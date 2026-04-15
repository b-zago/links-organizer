# Links Organizer

A web app for organizing links into custom folders. Save YouTube videos, articles, tutorials, or any URL — keep everything structured and easy to find.

## How it works

- Create folders and nest them however you like
- Add links with a title, URL, and optional description
- Navigate folders with breadcrumb navigation
- You can test it out without an account — data is saved in app memory
- Sign in to persist your data server-side and access it from anywhere

## Stack

- **Frontend** — React + Vite + Tailwind
- **Backend** — Node.js + Express
- **Database** — PostgreSQL
- **Auth** — JWT

## Dev Scripts

- `npm run dev` - starts all containers with live file watching
- `npm run down` - stops and removes all containers
- `npm test` - runs Jest tests in an isolated test environment
- `npm run logs` - streams logs from all containers
- `npm run logs-node` - streams logs from the Node.js backend
- `npm run logs-db` - streams logs from the Postgres database
- `npm run logs-vite` - streams logs from the React frontend
