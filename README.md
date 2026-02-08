# Express + Next.js SSE Demo

A small and easy full-stack project that uses:

- **Express.js** for a Server-Sent Events (SSE) endpoint
- **Next.js** frontend to listen to and render incoming events in real time

## Project structure

- `server/` — Express backend
- `client/` — Next.js frontend

## 1) Run the Express SSE server

```bash
cd server
npm install
npm start
```

Server starts on `http://localhost:4000`.

Available endpoints:

- `GET /health` → simple health check
- `GET /events` → SSE stream with one event every 2 seconds

## 2) Run the Next.js frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000`.

You should see:
- Connection status
- A live event counter
- A growing list of messages received from the Express SSE server

## Notes

- The frontend connects to `http://localhost:4000/events`.
- CORS is enabled in the backend for local development.
