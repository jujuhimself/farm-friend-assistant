export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      listings: {
        Row: {
          category: string | null
          certifications: string[] | null
          created_at: string
          crop: string
          description: string | null
          grade: string | null
          harvest_season: string | null
          id: string
          image: string | null
          origin: string
          price: number
          price_unit: string | null
          region: string | null
          status: string | null
          stock_period: string | null
          supplier_id: string
          updated_at: string
          volume: string
        }
        Insert: {
          category?: string | null
          certifications?: string[] | null
          created_at?: string
          crop: string
          description?: string | null
          grade?: string | null
          harvest_season?: string | null
          id?: string
          image?: string | null
          origin: string
          price: number
          price_unit?: string | null
          region?: string | null
          status?: string | null
          stock_period?: string | null
          supplier_id: string
          updated_at?: string
          volume: string
        }
        Update: {
          category?: string | null
          certifications?: string[] | null
          created_at?: string
          crop?: string
          description?: string | null
          grade?: string | null
          harvest_season?: string | null
          id?: string
          image?: string | null
          origin?: string
          price?: number
          price_unit?: string | null
          region?: string | null
          status?: string | null
          stock_period?: string | null
          supplier_id?: string
          updated_at?: string
          volume?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_id: string
          container: string | null
          created_at: string
          crop: string
          destination: string | null
          eta: string | null
          id: string
          incoterm: string | null
          inspection_status: string | null
          listing_id: string | null
          notes: string | null
          payment_status: string | null
          price: number
          status: string | null
          supplier_id: string | null
          total: number
          updated_at: string
          vessel: string | null
          volume: string
        }
        Insert: {
          buyer_id: string
          container?: string | null
          created_at?: string
          crop: string
          destination?: string | null
          eta?: string | null
          id?: string
          incoterm?: string | null
          inspection_status?: string | null
          listing_id?: string | null
          notes?: string | null
          payment_status?: string | null
          price: number
          status?: string | null
          supplier_id?: string | null
          total: number
          updated_at?: string
          vessel?: string | null
          volume: string
        }
        Update: {
          buyer_id?: string
          container?: string | null
          created_at?: string
          crop?: string
          destination?: string | null
          eta?: string | null
          id?: string
          incoterm?: string | null
          inspection_status?: string | null
          listing_id?: string | null
          notes?: string | null
          payment_status?: string | null
          price?: number
          status?: string | null
          supplier_id?: string | null
          total?: number
          updated_at?: string
          vessel?: string | null
          volume?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          active: boolean
          condition: string
          created_at: string
          crop: string
          id: string
          target_price: number
          triggered: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          condition: string
          created_at?: string
          crop: string
          id?: string
          target_price: number
          triggered?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          condition?: string
          created_at?: string
          crop?: string
          id?: string
          target_price?: number
          triggered?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          company_name: string | null
          country: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          registration_id: string | null
          trust_score: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          registration_id?: string | null
          trust_score?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          registration_id?: string | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      rfqs: {
        Row: {
          buyer_id: string
          created_at: string
          crop: string
          delivery_timeline: string | null
          id: string
          notes: string | null
          origin: string | null
          status: string | null
          target_price: number | null
          updated_at: string
          volume: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          crop: string
          delivery_timeline?: string | null
          id?: string
          notes?: string | null
          origin?: string | null
          status?: string | null
          target_price?: number | null
          updated_at?: string
          volume: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          crop?: string
          delivery_timeline?: string | null
          id?: string
          notes?: string | null
          origin?: string | null
          status?: string | null
          target_price?: number | null
          updated_at?: string
          volume?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "buyer" | "supplier" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["buyer", "supplier", "admin"],
    },
  },
} as const
