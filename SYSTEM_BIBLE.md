# Grain X - Terminal System Bible

## 1. Vision & Design Philosophy
Grain X is a high-performance B2B agricultural commodity export platform. 
**Design Language**: A hybrid "Bloomberg Terminal meets StockX" aesthetic.
- **Terminal UI**: Monospaced fonts (JetBrains Mono), scanline overlays, and high-density data visualizations to convey authority and security.
- **Market Dynamics**: Inspired by high-end consumer marketplaces (StockX), using "Last Sale," "Market Depth," and "Price History" logic for raw commodities.

## 2. Platform Actors
- **Buyers**: International firms (e.g., UAE, China, Ireland) sourcing commodities. Need high-fidelity intel, escrow safety, and real-time logistics.
- **Suppliers**: Tanzanian aggregators/warehouses. Need inventory depth management and RFQ bidding protocols.
- **Admins**: System operators managing KYC/Verification, global GMV monitoring, and dispute resolution via AI-assisted audits.

## 3. Core Workflows & Modules

### A. Commodity DNA & Market Intelligence (The Intel Node)
- **Deep Discovery**: Massive search interface for browsing crop-specific profiles.
- **Stock Profiles**: Each crop (Avocado, Maize, Vanilla) features a dedicated analytics page with interactive price history (Recharts), regional production heatmaps (Volume vs. Price), and harvest calendars.
- **Importer Matrix**: Real-time logistics data for specific corridors (Dar to Shanghai/Dublin), including transit times and mandatory compliance documents (SGS, Phytosanitary).

### B. Inventory Sourcing & Marketplace
- **Verified Listings**: Direct-to-supplier stock listings with grade-specific pricing (A, AA, AAA).
- **Market Depth**: Live view of available lots within the intelligence view to bridge research and execution.

### C. Discovery & RFQ Protocol
- **AI-Parsed RFQ**: Gemini AI converts natural language requests into structured trade protocols.
- **Match Engine**: Automatically ranks the top 5 suppliers based on OTD (On-Time Delivery), proximity, and quality pass probability.

### D. Trade Finalization (The Checkout Node)
- **Configurable Terms**: Toggle between Incoterms (FOB, CIF, EXW) with real-time fee recalculation.
- **Escrow Lock**: Funds held in secure protocol until destination port quality verification is cleared.

### E. Logistics & Telemetry Tracking
- **Sat-Link Mapping**: Real-time vessel/container tracking via Google Maps.
- **Asset Telemetry**: Live monitoring of internal container conditions (Temperature, Humidity) to ensure GAPs (Good Agricultural Practices).

### F. Price Alert & Threshold Monitoring
- **Trigger Matrix**: User-defined alerts for price floors/ceilings.
- **Signal Uplink**: Push notifications when global market volatility hits specific crop targets.

## 4. Technical Architecture

### Frontend Stack
- **Framework**: React 19 (ESM via esm.sh).
- **Motion**: Framer Motion for high-fidelity state transitions.
- **Charts**: Recharts for terminal-grade financial data visualization.
- **AI**: Google Gemini 3 Flash/Pro for NLP parsing and image-based document verification (Vision AI).

### AI Agent: Grain X Agent V4
- **Role**: A persistent side-panel assistant capable of analyzing sourcing strategies, ranking suppliers, and providing "Technical Briefings" on crop seasonality and trade risks.

## 5. Deployment & Security
- **Uplink Integrity**: AES-256 encryption simulated for all trade data.
- **Performance**: Edge-cached assets for low-latency access in low-bandwidth regional trade hubs.