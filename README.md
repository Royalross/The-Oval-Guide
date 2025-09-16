# The Oval Guide

The Oval Guide brings together a Spring Boot API and a Next.js web client to help students search for professors, explore classes, and share reviews.

## Repository layout
- `TheOvalGuide-back` — Java 21 / Spring Boot service backed by PostgreSQL.
- `theovalguide-front` — Next.js 15 + React 19 application for the user interface.

## Quick start
1. `cd TheOvalGuide-back` and run `docker compose up postgres` to start the local database.
2. In the same folder, launch the API with `./mvnw spring-boot:run` (listens on `http://localhost:8080` by default).
3. `cd theovalguide-front`, run `pnpm install`, create a `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8080`, then start the web app with `pnpm dev`.
4. Visit `http://localhost:3000` to use the site.

## More information
- Backend guide: [TheOvalGuide-back/README.md](TheOvalGuide-back/README.md)
- Front-end guide: [theovalguide-front/README.md](theovalguide-front/README.md)
