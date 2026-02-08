# Student / Teacher SSE Demo (Express + Next.js)

This project is a small and easy example for your use case:

- **Student** submits an answer
- **Teacher** sees results in real time (via SSE)

## Why did it reset to 0 on refresh before?

Yes, that behavior is normal when state is stored only in frontend memory.
On page refresh, React state resets.

In this version, results are stored in the backend memory and loaded via `GET /results`, then live updates come from `GET /events`.

## Project structure

- `server/` — Express backend
- `client/` — Next.js frontend

## Backend API

- `GET /health` → health check
- `GET /results` → all submitted answers
- `POST /submit` → create new student submission
- `GET /events` → SSE stream for teacher live updates

Example payload for `POST /submit`:

```json
{
  "studentName": "Ali",
  "questionId": "Q1",
  "answer": "Paris",
  "isCorrect": true
}
```

## Run backend (Express)

```bash
cd server
npm install
npm start
```

Runs on `http://localhost:4000`.

## Run frontend (Next.js)

In another terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000`.

## How to test quickly

1. In the **Student** form, submit answers.
2. In the **Teacher** panel, see live results immediately.
3. Refresh the page: previous submissions are still shown (loaded from backend `/results`).

## Do you need backend now?

For your real student/teacher scenario, **yes**.
You need backend to:
- share data between different users/devices
- persist and validate submissions
- broadcast updates to teachers

Without backend, each browser only sees its own local data.
