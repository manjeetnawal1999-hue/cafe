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
Push to GitHub, then configure GitHub Pages (or another static host) to deploy the Vite `dist` directory. Add these repository Actions secrets or Pages build environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The GitHub Actions workflow builds the site and publishes it to Pages.

## Business details to customize
- Phone: +91 1234567890
- Price range: ₹49–₹500
- Update address, opening hours, email and social links in `index.html`.
- Replace sample menu items and photos as needed.

## Booking note
A submitted request is stored as `pending`. The cafe must contact the customer and confirm availability; the form does not promise an automatic confirmed table.
