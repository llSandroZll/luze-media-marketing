# Project Context — Criptana 360 & LUZE Media Marketing

> [!NOTE]
> This document acts as the core memory and state transfer registry for this project. If you are a new AI agent resuming work, read this file first to understand the architecture, completed milestones, and active roadmap.

---

## 📋 1. Project Overview & Scope

This repository houses two integrated premium portals:
1. **Criptana 360** (`index.html` & `index-en.html`): An interactive, bilingual (ES/EN) high-end tourism portal and smart itinerary builder for Campo de Criptana. It features a detailed bespoke vector map, dynamic step-by-step traveler wizard, and local recommendations.
2. **LUZE Media Marketing** (`anunciate.html` & blog entries): The digital marketing agency platform representing local monetization, rural/cave hotel affiliates, and local B2B sponsored ad placement.

---

## 🛠️ 2. Tech Stack & Serverless Architecture

* **Frontend**: Vanilla HTML5, CSS3, and modern ES6 JavaScript. The styling is handcrafted in `style.css` (warm monochrome / traditional Añil blue palette) without heavy frameworks to ensure sub-second rendering speeds.
* **Hosting**: Hosted as a static site via **GitHub Pages** (live deployment pushes directly from `origin/main`).
* **Database & Mailer Fallback**:
  * **Interactive Itinerary Sharing**: Uses a client-side serverless `mailto:` deep link configuration inside `app.js` to preformat plain-text timelines and pop them directly into the traveler's native email client (To, CC, Subject, and pre-formatted body pre-filled) for **100% free deliverability**.
  * **Newsletter Subscriptions**: Re-engineered with a **dual-tier system**:
    1. Worker API: Sends a `POST` request to `/api/subscribe` targeting a Cloudflare Worker linked to a **Cloudflare D1 SQL database**.
    2. Fail-Safe Local Storage: If the Cloudflare Worker isn't deployed yet, it automatically caches the email locally inside `localStorage` (`criptana_newsletter_subscribers`).
    3. CSV Export: Admin can download all local subscribers instantly by running `window.exportNewsletterSubscribers()` from the browser console.

---

## 📁 3. Core Files & Directory Structure

* [index.html](file:///C:/Users/zeval/Documents/LUZE%20Media%20Marketing/index.html) — Spanish Criptana360 interactive tourism portal and planner.
* [index-en.html](file:///C:/Users/zeval/Documents/LUZE%20Media%20Marketing/index-en.html) — English Criptana360 interactive tourism portal and planner.
* [app.js](file:///C:/Users/zeval/Documents/LUZE%20Media%20Marketing/app.js) — The core client-side engine (wizard, spot data, timeline generators, map pins updater, email mailto linker, CSV export).
* [style.css](file:///C:/Users/zeval/Documents/LUZE%20Media%20Marketing/style.css) — Custom premium stylesheets, responsive sunset-mode (dark mode), vector animations, and `@media print` rules.
* [anunciate.html](file:///C:/Users/zeval/Documents/LUZE%20Media%20Marketing/anunciate.html) — Agency client lead funnel and sponsorships.
* [blog/](file:///C:/Users/zeval/Documents/LUZE%20Media%20Marketing/blog/) — SEO-optimized premium articles (e.g. `blog/cave-houses.html`).
* [backend/](file:///C:/Users/zeval/Documents/LUZE%20Media%20Marketing/backend/) — Serverless Cloudflare Worker API code, SQLite `schema.sql`, and `wrangler.toml` configuration.

---

## 🏆 4. Completed Milestones & Premium Features

### 🗺️ A. Interactive Geographical Vector Map
* **Google Map-Accurate Street Grid**: Replaced outdated curved lines with an authentic vector representation of Criptana streets (*CM-420 bypass*, *Calle Castillo*, roundabouts) and coordinates (`39°24' N`, `3°07' W`).
* **Rotating Windmills**: Three beautifully-detailed vector windmills on the Sierra ridge with sails spinning organically at different speeds using smooth CSS keyframe animations.
* **Uniform Category-Coded Badges**: Pins are represented by premium circular badges with custom Lucide-styled line-art SVGs (Columns for heritage, Burgundy wine bottles for wineries, Corals for dining, Teals for hotels, etc.).
* **Checkmarks & Active Glows**: Pins glow with a soft golden auric animation and show a `✓` checkmark the moment their target spot is active in the itinerary.

### 🧭 B. Smart Itinerary Sync & Layout Optimizations
* **Timeline-Map Pin Sync**: Refactored `app.js` to gather all timeline items (selected spots AND dynamically recommended restaurants/dining) into a unified render array. Every single spot on the timeline now lights up on the map.
* **Symmetrical Step 5 Options**: Re-ordered the final step onward-town buttons, placing **"Volvemos a casa / Terminar ruta"** first. Converted the layout into a centered Flexwrap with uniform dimensions so wrapping buttons center symmetrically on the page instead of sitting awkwardly on the left.
* **Dashboard Split & Highlight**: Split the final itinerary controls into two groups aligned perfectly with the `720px` timeline column width:
  * *Left Group*: Housekeeping buttons **"Limpiar Ruta"** and **"Copiar Texto"** (outline style).
  * *Right Group*: Call-to-actions **"Enviar por Email"** (highlighted solid blue primary button) and **"Imprimir Ruta"** (outline style).
* **Restart Wizard Centering**: Centered the "Reiniciar Asistente" wrapper to align perfectly with the dashboard column.

### 🖨️ C. High-Density Print Sheet Optimizations
* **Zero Ad Clutter**: Set `.native-ad-banner`, `.itinerary-sticky-bar`, and the B2B ad sidebar to hide completely in print, alongside static action buttons.
* **High-Density Compact Grid**:
  * Set `.timeline-item` to break organically across pages (`break-inside: auto`) while holding `.timeline-card` unified (`break-inside: avoid`). This eliminates "big white gaps" at the bottom of printed pages.
  * Reduced card padding and shrank images from `120px` to `90px` in print to compact height.
  * Decreased timeline margins to fit multiple cards per page beautifully.
* **Pristine Page Margins**: Implemented a `@page { size: auto; margin: 15mm 20mm; }` stylesheet to strip default browser URL headers and page numbers.

### 📱 D. High-Contrast Accessibility & Mobile Layouts
* **Accessible Email Inputs**: Overhauled the Share Modal inputs to render Slate-900 text on a Slate-50 background in light mode, and silver text on a deep Slate-950 background with `rgba(255, 255, 255, 0.4)` placeholders in sunset mode, providing high contrast and comfortable legibility.
* **Mobile Ad Centering**: Updated the max-width 768px media queries to horizontally center the Bodeboca ad container, text, and its affiliate button using `justify-self: center`.
* **Mobile Button Stacking**: Configured the split actions to stack vertically on mobile and stretch to `100%` width for a finger-friendly touch interface.

---

## 🔮 5. Future Roadmap & Pending Actions

1. **Activate Cloudflare Worker API**:
   * Navigate to `backend/` folder and execute `npx wrangler d1 create criptana360-db` to generate a Cloudflare D1 SQL database.
   * Apply the table schema: `npx wrangler d1 execute criptana360-db --file=schema.sql`.
   * Replace the `database_id` string inside `backend/wrangler.toml` with the D1 DB ID returned by Cloudflare.
   * Deploy the API: `npx wrangler deploy`.
2. **Review Aggressive Mobile Browser Caching**:
   * Remember to test mobile revisions with cache-busting query strings, e.g., `https://www.criptana360.com/?nocache=true`, to completely bypass aggressive OS-level caching.
