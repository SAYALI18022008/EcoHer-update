# EcoHer — Frontend Prototype

**Tagline:** Grow with purpose. Build with trust.

A fresh, responsive, frontend-only prototype using HTML, CSS, and vanilla JavaScript. It uses browser `localStorage` for demonstration accounts and demo records. No backend, Supabase, API key, or payment gateway is required.

## Run locally

1. Extract the ZIP.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. Create an account with one of the three roles: Entrepreneur, Mentor, or Customer.
4. Use the same browser to log in again; demo accounts are stored locally.

## Included prototype flows

- Responsive landing page, product marketplace, city/category search, product details, and favourites.
- Registration with role-specific fields and local demo login/logout.
- Role-aware dashboards with a login gate.
- Entrepreneur product CRUD and seller-submitted sustainability information/status.
- Sales and expense entries with revenue, expenses, and estimated profit calculations.
- Rule-based EcoHer Business Coach with local chat history.
- Customer cart, quantity controls, simulated checkout, and order history.
- Mentor request submission and request status actions.
- Impact records and local privacy preferences.
- English, Hindi, and Marathi language selector. Core landing-page and common dashboard labels are translated; some detailed content remains in English.
- Demo product and mentor content is clearly labelled as sample data.

## Image note

The hero uses a bundled generated image of an Indian woman entrepreneur, so it does not depend on an external hero-image URL. Product cards use product-focused remote photography; they do not intentionally show people. Product image URLs need an internet connection.

## Important limitations

- This is a learning/demo prototype, not production authentication. Passwords are stored in localStorage in plain text.
- LocalStorage is not encrypted and is not a secure database.
- Verification statuses are illustrative. No independent sustainability certification is performed.
- Checkout is simulated. No real payment is taken.
- Mentor request simulation is local; it is not a multi-user backend and does not synchronize across devices.
- The translation dictionary covers the main navigation, landing page, and common UI labels; it is not a complete professional translation of every dynamic string.
- The prototype has not been independently security-audited or tested across all browsers.

## Files

- `index.html` — page structure and landing sections
- `styles.css` — responsive EcoHer visual design
- `app.js` — local demo data, UI interactions, role flows, and persistence
