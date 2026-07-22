# INSTRUCTIONS.md — Project: LICDT Portal

## 1. Project Overview
Build **lictd** (LGU ICT Division Portal), a high-performance, 3D scroll-animated developer landing page and system aggregator. Designed like a top-tier digital agency portfolio (e.g., Vercel, Linear, Apple Developer), it highlights LGU systems, live metrics, and division services.

---

## 2. Tech Stack & Architecture
* **Framework:** HTML5, Tailwind CSS (via CDN or PostCSS), JavaScript (ES6 Modules).
* **3D & Animation Engines:** Three.js / Canvas API, GSAP (GreenSock) + ScrollTrigger.
* **Data Architecture:** Fully decoupled, JSON-driven.
  * `apps.json`: Directory of systems, links, categories, and API endpoints.
  * `/api/stats`: Fallback/mock data handlers for live system metrics.
* **Architecture Style:** Single-Page Application (SPA) layout with dynamic overlay modals for system detail dashboards.

---

## 3. UI/UX Specifications (UI/UX Pro Max)
* **Visual Theme:** Cyberpunk/Enterprise Dark Mode (Deep Slate `#090d16`, Electric Cyan `#00f2fe`, Neon Violet `#7000ff`).
* **Typography:** `Plus Jakarta Sans` or `Inter` for clean readability.
* **3D Scroll Dynamics:**
  * **Hero Section:** Interactive 3D particle sphere / wireframe grid responsive to mouse hover and page scroll position.
  * **App Directory:** 3D perspective cards with depth tilts (`transform: rotateX/rotateY`) following cursor/scroll.
  * **Background Dynamics:** Smooth gradient meshes shifting hues on vertical scroll progress.
* **Feel:** Sleek, modern, fast, hyper-professional digital agency vibe.

---

## 4. File Structure
```
lictd/
├── index.html
├── INSTRUCTIONS.md
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── three-scene.js
│   │   └── stats-fetcher.js
│   └── data/
│       └── apps.json
└── mock-api/
    ├── rpt-stats.json
    └── social-welfare-stats.json
```

---

## 5. Core Features & Code Templates

### 5.1 Data Structure (`assets/data/apps.json`)
```json
[
  {
    "id": "rpt-system",
    "title": "Real Property Tax System",
    "tagline": "Automated land valuation & billing portal",
    "category": "Finance",
    "url": "https://rpt.lgu.gov.ph",
    "statsEndpoint": "/mock-api/rpt-stats.json",
    "status": "online",
    "accessLevel": "Internal",
    "icon": "calculator"
  },
  {
    "id": "social-welfare",
    "title": "Social Assistance Tracker",
    "tagline": "Financial assistance disbursement registry",
    "category": "Social Services",
    "url": "https://welfare.lgu.gov.ph",
    "statsEndpoint": "/mock-api/social-welfare-stats.json",
    "status": "online",
    "accessLevel": "Public",
    "icon": "heart-handshake"
  }
]
```

### 5.2 API Contract (`mock-api/rpt-stats.json`)
```json
{
  "systemId": "rpt-system",
  "status": "online",
  "metrics": [
    { "label": "Queries Served Today", "value": "1,420", "type": "number" },
    { "label": "Entries Encoded", "value": "890", "type": "number" },
    { "label": "Collections Processed", "value": "₱1.2M", "type": "currency" }
  ]
}
```

---

## 6. Layout & Key Components

### 6.1 Hero Section
* **Title:** `LICTD` — *Next-Gen Municipal Digital Infrastructure*
* **3D Canvas:** `three-scene.js` rendering a floating node-network grid representing LGU connectivity.
* **Scroll Call to Action:** Animated glassmorphism scroll indicator.

### 6.2 App Directory & Filter Bar
* **Controls:** Search input with live filtering + category filter tags (All, Finance, Social Services, Internal, Citizen Services).
* **Grid Layout:** Responsive 3-column 3D tilt cards.
* **Card Details:** Status indicator LED, Title, Category Tag, "Launch System" button, and "View Live Metrics" button.

### 6.3 System Dashboard Modal (Live Metrics)
* Clicking "View Live Metrics" opens a glassmorphic overlay modal.
* **Behavior:** Async fetches `statsEndpoint`. Displays dynamic KPI stat boxes with smooth counter animations.
* **Fallback:** Shows "Stats Temporarily Unavailable" if fetch fails without blocking page UI.

---

## 7. Development Guidelines & Execution Workflow
1. **Initialize Project:** Create directories and files listed in the File Structure.
2. **Setup Three.js & GSAP:** CDN links in `index.html`:
   * Three.js: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
   * GSAP + ScrollTrigger: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`, `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`
3. **Data Fetching:** Standard `fetch()` implementation with `localStorage` 5-minute cache for metrics.
4. **Build & Test:** Ensure responsive behavior across mobile, tablet, and desktop viewports.
