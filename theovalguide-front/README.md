# The Oval Guide Frontend

This Next.js 15 app renders the student-facing experience for The Oval Guide, including search, class, and professor detail pages, and authentication flows.

## Prerequisites
- Node.js 20+
- pnpm 

## Run locally
1. `pnpm install`
2. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8080`
3. `pnpm dev` to start the development server
4. Open `http://localhost:3000` in your browser

## Features
- Landing page with an autosuggest search box backed by the `/api/search` endpoint.
- `/search` results view for free-form queries.
- Class detail pages showing difficulty buckets, professor list, advice, and notes previews.
- Professor detail pages with summaries, rating distribution, reviews, and a dialog to add new feedback.
- Authentication flows: sign-in, sign-up, forgot password, and reset password screens.
- In-page forms for submitting class reviews.

## Scripts
- `pnpm dev` — run the Next.js dev server.
- `pnpm build` — generate a production build.
- `pnpm lint` — run ESLint.
- `pnpm format` — apply Prettier formatting.
