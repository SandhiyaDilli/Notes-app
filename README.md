# Notes App (PERN Stack)

A full-stack notes application with user authentication, note management, and tagging. Built with **PostgreSQL, Express, React and Node.js**.

## Features

- Sign up and log in with secure authentication (bcrypt password hashing + JWT)
- Create, edit and delete personal notes
- Attach multiple tags to each note
- Each user can only see and modify their own notes
- Protected API routes using custom authentication middleware

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), plain CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (hosted on Supabase) |
| Auth | JSON Web Tokens (`jsonwebtoken`), `bcrypt` |
| Other | `pg` (connection pool), `cors`, `dotenv` |

## How It Works

1. **Signup:** the password is hashed with bcrypt before it is stored.
2. **Login:** the password is verified with bcrypt, then a JWT (payload: `u_id`, expires in 3 hours) is returned.
3. The frontend stores the token in `localStorage` and sends it as `Authorization: Bearer <token>` on every request.
4. The `authenticate` middleware verifies the token and attaches `req.u_id`, so every query is scoped to the logged-in user.

### Database design

Notes and tags have a **many-to-many** relationship:

- `users`: `u_id`, `user_name`, `password` (hashed)
- `notes`: `note_id`, `note`, `u_id`, `updated_on`
- `tags`: `tag_id`, `tag_name`
- `note_tags`: `note_id`, `tag_id` (link table)

## Project Structure

```
Notes-app/
├── server.js               # Express app entry point
├── db.js                   # PostgreSQL connection pool
├── middleware/auth.js      # JWT verification middleware
├── routes/                 # auth.js, notes.js, tags.js
├── .env.example            # backend environment variables
└── notes-frontend/         # React (Vite) app
    ├── src/                # App, Login, Signup, CreateNote, NotesList, NoteCard, config.js
    └── .env.example        # frontend environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (local or hosted, e.g. Supabase)

### 1. Clone

```bash
git clone https://github.com/SandhiyaDilli/Notes-app.git
cd Notes-app
```

### 2. Backend (from the repo root)

```bash
npm install
cp .env.example .env     # then fill in your own values
node server.js
```

The API runs on `http://localhost:3000`.

### 3. Frontend

```bash
cd notes-frontend
npm install
cp .env.example .env     # set VITE_API_URL
npm run dev
```

### Environment variables

**Backend (`.env` in the repo root)**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `PORT` | Optional, defaults to 3000 |

**Frontend (`notes-frontend/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend, e.g. `http://localhost:3000` |

## API Endpoints

All routes except signup and login require the header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Create an account |
| POST | `/auth/login` | Log in, returns a JWT |

### Notes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notes` | List the user's notes |
| GET | `/notes/with-tags` | List notes with their tags |
| GET | `/notes/:note_id` | Get a single note |
| POST | `/notes` | Create a note |
| PATCH | `/notes/:note_id` | Update a note |
| DELETE | `/notes/:note_id` | Delete a note |
| POST | `/notes/:note_id/tags` | Attach a tag to a note |
| DELETE | `/notes/:note_id/tags/:tag_id` | Remove a tag from a note |

### Tags

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tags` | Create a tag (returns the existing one if the name already exists) |
| GET | `/tags` | List all tags |

## Roadmap

- [ ] Remove and rename tags from the UI (backend unlink route already exists)
- [ ] Return tag IDs from `/notes/with-tags` (switch `STRING_AGG` to `json_agg`)
- [ ] Per-user tags
- [ ] User profile and dashboard
- [ ] Auto-logout when the token expires
- [ ] Deployment

## What I Learned

This is my first project with React and my first PERN stack app (my earlier project was a MEN stack to-do app). It taught me JWT authentication flow, Express middleware, relational design with a many-to-many link table, and React state management (`useState`, `useEffect`, lifting state up with callback props).

## Author

**Sandhiya Dilli**: [GitHub](https://github.com/SandhiyaDilli)