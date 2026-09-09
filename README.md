# KisanDirect — AI-Powered Farmer-to-Buyer Agricultural Marketplace

> **Smart India Hackathon (SIH 2026) Prototype & Production-Quality Architecture**  
> Direct farm-to-table agricultural commerce connecting Indian smallholders directly with consumers, commercial restaurants, retail marts, and food processing companies.

---

## 🌾 The Problem & The KisanDirect Solution

### The Multi-Tier Middleman Challenge
In traditional Indian agricultural supply chains, produce moves through 4 to 6 intermediary layers:
$$\text{Farmer} \longrightarrow \text{Village Trader} \longrightarrow \text{APMC Mandi Wholesaler} \longrightarrow \text{Distributor} \longrightarrow \text{Retailer} \longrightarrow \text{Consumer}$$

This intermediation forces farmers to realize only **25% to 35%** of the final consumer expenditure, while food spoilage escalates during transit hops.

### The KisanDirect Target Outcome
$$\text{Farmer} \longrightarrow \mathbf{KisanDirect\ Marketplace} \longrightarrow \text{Direct Buyer}$$

- **35% – 45% Higher Farmer Price Realization**
- **20% – 28% Procurement Savings for Buyers & Restaurants**
- **Harvest-Day Freshness Delivered in 24–36 Hours in Refrigerated Transit**
- **Zero Opaque Auctions • Digital Escrow Settlements • Algorithmic Price Guidance**

---

## 🚀 Key Platform Features

1. **Direct Farmgate Marketplace (`/marketplace`)**:
   - Filter by crop, Maharashtra district (Pune, Nashik, Satara, Kolhapur, etc.), quality grade ($A+, A, B, C$), organic certification, and price.
   - Transparent price difference tags showing buyer savings on every card (e.g. *"Save ₹4/kg"*).

2. **Transparent Price Journey Component**:
   - Visual step-by-step breakdown comparing traditional 5-stage middleman markups against KisanDirect direct farmgate pricing.
   - Clear labeling of estimated regional APMC benchmarks.

3. **AI Smart Price Recommendation (`AIService`)**:
   - Provider-abstracted AI engine supporting Google Gemini, OpenAI, and heuristic agro-economic models.
   - Considers crop variety, quality grade, quantity, location, and seasonal demand.
   - Outputs optimal price range (e.g. ₹18 – ₹21/kg), suggested price (₹20/kg), economic reasoning, and confidence score ($84\%$).
   - Explicitly marked as *"AI-assisted estimate"*.

4. **30-Day AI Demand Forecasting**:
   - Predicts High, Medium, or Low demand tiers for each crop with 7-day and 30-day percentage projections (e.g. Tomato $+14\%$).
   - Graceful handling when historical transaction density is low: *"Not enough historical data for reliable prediction."*

5. **Computer Vision Crop Quality Assessment**:
   - Diagnostic grading tool evaluating color uniformity, freshness score, surface defect percentage, and commercial size consistency.

6. **Buyer Bidding & Negotiation System**:
   - Commercial buyers (restaurants, hotels) can submit counter-offers with custom prices and volumes.
   - Farmers can **Accept**, **Reject**, or **Counter-Offer** with instant in-app alerts.

7. **Server-Side Verified Payments (Razorpay Integration)**:
   - Client initiates Razorpay Checkout; backend verifies cryptographic HMAC SHA-256 signatures server-side.
   - Never trusts browser status flags; strict payment record logging without storing CVV or card numbers.

8. **Transparent Farmer Settlement**:
   - Real-time payout ledger: $\text{Net Payout} = \text{Order Gross} - \text{2\% Platform Fee}$.
   - Direct simulated disbursement to verified Bank of Maharashtra accounts.

9. **Live GPS Logistics Tracking**:
   - Real-time route visualization from farmgate origin to buyer destination with milestone checkpoints (`ORDER_CONFIRMED` $\to$ `PICKUP_ASSIGNED` $\to$ `PICKED_UP` $\to$ `IN_TRANSIT` $\to$ `NEAR_DESTINATION` $\to$ `DELIVERED`).

10. **Platform Governance & Admin Dashboard (`/admin/dashboard`)**:
    - Real-time GMV counters, regional volume distribution charts, dispute resolution center, and a 1-click **Farmer KYC Verification Queue**.

11. **Dedicated SIH Innovation Presentation (`/innovation`)**:
    - Comprehensive showcase detailing the problem, supply chain architecture comparison, technology stack, business model, unit economics, and projected impact.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict Mode) |
| **Styling & Theme** | Tailwind CSS (Custom agricultural palette: Emerald, Harvest Gold, Forest) |
| **Icons & UI** | Lucide React, Glassmorphism, Canvas Confetti |
| **Database ORM** | Prisma ORM 5.x |
| **Database Engine** | SQLite (Default zero-config local runnability) / PostgreSQL ready |
| **Authentication** | Session cookie auth with 1-click SIH Demo Persona Switcher |
| **Payments** | Razorpay Test Mode with server-side HMAC signature verification |
| **AI Layer** | Provider-abstracted `AIService` (Gemini 1.5 Flash / OpenAI / Heuristic Engine) |
| **Testing** | Node / tsx Automated Unit Test Suite (`npm test`) |

---

## 🧑‍🌾 Pre-Configured SIH Evaluation Accounts

Use the **1-Click Role Switcher** in the top navigation bar or log in with password `kisan123`:

| Role | Name | Email | Persona Details |
|---|---|---|---|
| **Farmer** | Ramesh Patil | `ramesh.patil@kisandirect.in` | Pune Organic Tomato & Alphonso Mango farmer (8.5 Acres, PGS-India certified) |
| **Farmer** | Suresh Jadhav | `suresh.jadhav@kisandirect.in` | Nashik Red Onion & G4 Chilli producer (14 Acres) |
| **Restaurant Buyer** | Rahul Sharma | `rahul.buyer@kisandirect.in` | GreenBite Bistro & Commercial Kitchen, Shivajinagar Pune |
| **Consumer** | Priya Deshmukh | `priya.consumer@kisandirect.in` | Household organic produce subscriber, Kothrud Pune |
| **Delivery Partner** | Vikram Shinde | `vikram.delivery@kisandirect.in` | KisanLogistics refrigerated agro-transit driver |
| **Admin** | Pooja Kulkarni | `admin@kisandirect.in` | State Agricultural Directorate platform administrator |

---

## 🏁 Quickstart Setup & Local Runnability

The project is completely self-contained and requires **no external database server** to run locally.

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database & Seed Maharashtra Data
```bash
# Push schema to local SQLite database (dev.db)
npm run prisma:push

# Seed authentic farmers, products, collection hubs, and initial orders
npm run prisma:seed
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Server & Open in Any Browser

You can access the website in any external browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari, or mobile browsers) using the following methods:

#### Option A: 1-Click Launch (Recommended)
Double-click `start-and-open.bat` in the project folder, or run:
```bash
npm run dev
# In another terminal or command prompt:
npm run open
```

#### Working URLs for Any Browser:
- **Local Browser:** [http://localhost:3000](http://localhost:3000)
- **Direct IPv4 Loopback:** [http://127.0.0.1:3000](http://127.0.0.1:3000)
- **Local Wi-Fi / Mobile Device:** `http://<your-local-ip>:3000` (e.g. `http://10.95.64.33:3000`)
- **Public Shareable Web URI (Tunnel):** Run `npm run tunnel` to get a live HTTPS URL accessible from any device anywhere.

#### Option B: Deploy to the Cloud (Production Web URI)
To deploy as a permanent online website:
1. **Vercel (1-Click):**
   ```bash
   npx vercel
   ```
2. **Render / Railway / Netlify:**
   - Connect your GitHub repository
   - Build Command: `npm run build`
   - Start Command: `npm run start`

---

## 🎬 Complete SIH Demonstration Flow

1. **Farmer Experience**:
   - Click the top-nav **Role Switcher** $\to$ Select **Ramesh Patil (Farmer)**.
   - Go to **+ List Produce** (`/farmer/produce/new`).
   - Enter Tomato, Grade A, 500 kg, ₹18/kg.
   - Click **Generate AI Price**: Observes suggested price ₹20.4/kg (Range: ₹18.4 – ₹22.4), 84% confidence.
   - Click **Analyze Crop Image**: Reviews computer vision quality breakdown (uniform color, low defects, Grade A).
   - Click **Publish Produce Listing**.
2. **Buyer Discovery & Price Transparency**:
   - Switch role to **Rahul Sharma (GreenBite Bistro)**.
   - Visit the **Marketplace** (`/marketplace`) $\to$ Search & select Tomato.
   - Inspect the **Price Journey** component: Farmer ₹18/kg vs Traditional Retail ₹28/kg (Potential saving ₹10/kg).
   - Enter quantity 100 kg and click **Buy Now**.
3. **Digital Escrow Payment**:
   - Razorpay test checkout dialog opens with cost breakdown (Produce ₹1,800 + 2% Platform Fee ₹36 + Logistics ₹150 = Total ₹1,986).
   - Click **Simulate Pay**: Server verifies the signature, confetti triggers, and order transitions to `PAID` & `CONFIRMED`.
4. **Logistics & Delivery**:
   - Navigate to **Live Tracking** (`/buyer/tracking/[orderId]`).
   - Observe the interactive Maharashtra map route from Manchar Farmgate to Koregaon Park.
   - Click **Simulate Next Milestone** to advance through Picked Up $\to$ In Transit $\to$ Delivered.
5. **Farmer Review & Settlement**:
   - Upon delivery, submit a 5-star rating for Ramesh Patil.
   - Switch role back to **Ramesh Patil** $\to$ Open **Settlements** (`/farmer/payments`).
   - Verify net payout ₹1,764 automatically recorded and credited.
6. **Platform Governance & Presentation**:
   - Switch role to **Pooja Kulkarni (Admin)** $\to$ Open `/admin/dashboard` to inspect live GMV, top crop charts, and the KYC verification queue.
   - Open `/innovation` to present the complete SIH innovation slide architecture.

---

## 📡 API Reference Overview

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/me` | `GET` | Current authenticated session & role claims |
| `/api/auth/demo-login` | `POST` | 1-click instant persona switch for testing |
| `/api/products` | `GET`, `POST` | Search & filter products / Create farmer listing |
| `/api/products/:id` | `GET`, `PUT`, `DELETE`| Single product details, status update & deletion |
| `/api/ai/price-recommendation`| `POST` | AI farmgate price range calculation |
| `/api/ai/demand-forecast` | `GET` | 7-day and 30-day regional crop demand forecasts |
| `/api/ai/quality-check` | `POST` | Computer vision crop defect & grade evaluation |
| `/api/bids` | `GET`, `POST` | Create and query buyer negotiation offers |
| `/api/bids/:id` | `PUT` | Accept, reject, or counter-offer a bid |
| `/api/orders` | `GET`, `POST` | Place order / Query role-based order history |
| `/api/orders/:id/status` | `PUT` | Advance order & delivery status milestones |
| `/api/payments/create-order` | `POST` | Generate Razorpay order token |
| `/api/payments/verify` | `POST` | Cryptographic server signature verification |
| `/api/delivery/:id` | `GET` | Live telemetry, driver contact, and milestones |
| `/api/collection-centers` | `GET` | Directory of regional storage hubs |
| `/api/admin/dashboard` | `GET` | Platform metrics, crop volume charts & KYC queue |
| `/api/admin/verify-farmer/:id`| `PUT` | Approve or reject farmer verification badge |

---

## 🔒 Security & Best Practices

- **Zero Client Trust for Payments**: Payment amounts and signatures are strictly validated on the server side using SHA-256 HMAC.
- **Sensitive Credential Protection**: No credit card numbers, CVVs, or bank PINs are stored in the database.
- **Environment Isolation**: Live secrets and API keys are read strictly from process environment variables.
- **Graceful Degradation**: If external AI or payment APIs are offline, heuristic and test-mode adapters maintain 100% platform functionality.

---

## 📄 License & Attribution
Empowering Indian agriculture through transparent direct digital commerce.
