# CABIN CAFE

A responsive cafe website with online table booking requests and customer inquiry forms.

## Stack
- Static HTML, CSS and JavaScript (ES modules)
- Supabase Postgres via `@supabase/supabase-js`
- GitHub Pages-compatible build (Vite)

## Run locally
1. Install Node.js 20+.
2. `npm install`
3. Copy `.env.example` to `.env` and add your Supabase project URL and publishable key.
4. `npm run dev`

## Supabase setup
Run `supabase/schema.sql` in the Supabase SQL Editor. It creates:
- `cafe_bookings`: reservation requests (default status `pending`)
- `cafe_inquiries`: contact form messages

RLS is enabled. The public anonymous role can INSERT only; it cannot SELECT, UPDATE or DELETE customer records. Do not put a Supabase service-role/secret key in the frontend.

## Deploy
A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. It builds the Vite `dist` directory with the linked Supabase project URL and publishable key, then deploys it to GitHub Pages on every push to `main`.

In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. The publishable key is designed for browser use; database access is restricted by the RLS policies above. Never use a service-role or secret key in this site.

## Business details to customize
- Phone: +91 1234567890
- Price range: ₹49–₹500
- Update address, opening hours, email and social links in `index.html`.
- Replace sample menu items and photos as needed.

## Booking note
A submitted request is stored as `pending`. The cafe must contact the customer and confirm availability; the form does not promise an automatic confirmed table.
