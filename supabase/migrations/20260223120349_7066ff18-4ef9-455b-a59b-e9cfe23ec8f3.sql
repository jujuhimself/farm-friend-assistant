
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('buyer', 'supplier', 'admin');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT,
  display_name TEXT,
  email TEXT,
  country TEXT,
  registration_id TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  address TEXT,
  trust_score NUMERIC DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop TEXT NOT NULL,
  category TEXT DEFAULT 'Cereal Grains',
  origin TEXT NOT NULL,
  region TEXT,
  volume TEXT NOT NULL,
  price NUMERIC NOT NULL,
  price_unit TEXT DEFAULT 'USD/MT',
  grade TEXT DEFAULT 'A',
  status TEXT DEFAULT 'ACTIVE',
  image TEXT,
  description TEXT,
  harvest_season TEXT,
  stock_period TEXT,
  certifications TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- 6. RFQs table
CREATE TABLE public.rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop TEXT NOT NULL,
  volume TEXT NOT NULL,
  target_price NUMERIC,
  origin TEXT,
  delivery_timeline TEXT,
  notes TEXT,
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;

-- 7. Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID,
  listing_id UUID REFERENCES public.listings(id),
  crop TEXT NOT NULL,
  volume TEXT NOT NULL,
  price NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  incoterm TEXT DEFAULT 'FOB',
  destination TEXT,
  status TEXT DEFAULT 'ORDER CONFIRMED',
  vessel TEXT,
  container TEXT,
  eta TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  inspection_status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 8. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON public.rfqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. RLS Policies

-- Profiles: users can read/update own; admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles: users can read own; admins can read/manage all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Listings: public read; suppliers manage own; admins manage all
CREATE POLICY "Anyone can view active listings" ON public.listings FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Suppliers can manage own listings" ON public.listings FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Admins can manage all listings" ON public.listings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RFQs: buyers manage own; suppliers can view open; admins can view all
CREATE POLICY "Buyers can manage own rfqs" ON public.rfqs FOR ALL USING (auth.uid() = buyer_id);
CREATE POLICY "Suppliers can view open rfqs" ON public.rfqs FOR SELECT USING (status = 'OPEN' AND public.has_role(auth.uid(), 'supplier'));
CREATE POLICY "Admins can view all rfqs" ON public.rfqs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Orders: buyers/suppliers can view own; admins can view all
CREATE POLICY "Buyers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Suppliers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = supplier_id);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Suppliers can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = supplier_id);
