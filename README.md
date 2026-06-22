# Employee Frontend (React + Vite + Tailwind)

A single-page app that lists employees in a table and lets you add a new one through a modal form (built with `react-hook-form`). It talks to the existing Employee CRUD API running on your EC2 instance.

## 1. Clean up and install dependencies

If `node_modules` is already present in this folder (it may ship with this delivery from environment testing), delete it first:

```
cd employee-frontend
rm -rf node_modules package-lock.json
npm install
```

## 2. Configure the API base URL

```
cp .env.example .env
```

Edit `.env`:
- For local development against your local backend: `VITE_API_BASE_URL=http://localhost:3000/api`
- For pointing at your deployed EC2 backend: `VITE_API_BASE_URL=http://<your-ec2-public-ip>/api`

Vite only exposes variables to the browser if they're prefixed with `VITE_`, and it bakes this value in at **build time** — so if you change `.env`, you need to rebuild (`npm run build`) or restart the dev server.

## 3. Run it locally

```
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Make sure your backend (local or EC2) is actually running and reachable, and that its CORS settings allow requests from this origin (the existing backend already uses `cors()` with no restrictions, so this should just work).

## 4. Build for production

```
npm run build
```

This outputs static files into `dist/`, which is what gets uploaded to S3 (see `../04-FRONTEND-S3-DEPLOYMENT.md` for the full deployment + CI/CD guide).

## What to know for interviews

- Why `VITE_API_BASE_URL` is baked in at build time rather than read at runtime (Vite inlines `import.meta.env.*` values during the build — there's no Node server at runtime to read a `.env` file from, since this becomes static HTML/JS/CSS served from S3).
- How `react-hook-form` avoids re-rendering the whole form on every keystroke (uncontrolled inputs via `register`, validation only re-renders the field with an error).
- Why the table re-fetches the full list after a successful create instead of just appending the new row locally — it ensures the UI reflects exactly what the database (and JOINs, like the resolved department name) actually returned, not just an optimistic guess.
