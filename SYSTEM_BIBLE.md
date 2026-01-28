
# Grain X - Terminal System Bible

## 1. Vision
Grain X is a high-performance B2B agricultural commodity export platform connecting international buyers with Tanzanian suppliers. The design uses a terminal-inspired UI to convey speed, security, and technical precision.

## 2. Platform Actors
- **Buyers**: International firms sourcing commodities. High security requirements, needs escrow and logistics tracking.
- **Suppliers**: Local aggregators/warehouses. Needs inventory management and RFQ bidding tools.
- **Admins**: Platform operators. Review KYC, resolve disputes, and monitor global GMV.

## 3. Core Workflows
1. **Inventory Sourcing**: Suppliers list crops -> AI categorizes and optimizes price tags based on historical data.
2. **Discovery & RFQ**: Buyers find commodities -> Initiate RFQ -> Gemini AI helps parse and match the best 5 suppliers.
3. **Smart Contract Checkout**: Terms finalized -> Funds moved to Escrow (Stripe Connect) -> Trade "Locked".
4. **Logistics & Monitoring**: Warehouse to Port movement tracked via Google Maps + Container Telemetry.
5. **Quality Verification**: SGS/Bureau Veritas docs uploaded -> Vision AI verifies certificate authenticity.
6. **Settlement**: Delivered status confirmed -> Funds released to Supplier -> Buyer rates experience.

## 4. Backend Architecture Roadmap
- **Language**: Node.js with TypeScript (matches frontend).
- **Database**: PostgreSQL with PostGIS for location-based sourcing optimization.
- **Real-time**: Supabase Realtime or Socket.io for the live trade ticker.
- **Payments**: Stripe Connect (Separate Charges & Transfers) for safe B2B escrow.
- **AI**: Gemini 3 Pro for:
  - Document OCR (Invoices, Phytosanitary Certs).
  - Negotiation Chatbot (Price Leverage analysis).
  - News sentiment analysis.

## 5. Deployment
- **Frontend**: Vercel/Netlify for fast edge delivery.
- **Backend**: AWS Lambda or Google Cloud Run for elastic scaling.
- **CDN**: Cloudflare to optimize asset delivery for international buyers.
