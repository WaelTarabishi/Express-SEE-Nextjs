const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let nextId = 1;
const submissions = [];
const clients = new Set();

const sendToClient = (res, eventName, payload) => {
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

const broadcast = (eventName, payload) => {
  clients.forEach((res) => sendToClient(res, eventName, payload));
};

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "student-teacher-sse-server" });
});

app.get("/results", (req, res) => {
  res.json({ count: submissions.length, submissions });
});

app.post("/submit", (req, res) => {
  const { studentName, questionId, answer, isCorrect } = req.body || {};

  if (
    !studentName ||
    !questionId ||
    typeof answer !== "string" ||
    typeof isCorrect !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "Invalid payload. Required: studentName, questionId, answer, isCorrect(boolean).",
    });
  }

  const submission = {
    id: nextId,
    studentName: String(studentName),
    questionId: String(questionId),
    answer,
    isCorrect,
    submittedAt: new Date().toISOString(),
  };

  nextId += 1;
  submissions.unshift(submission);

  broadcast("submission", submission);

  return res.status(201).json({ ok: true, submission });
});

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();
  console.log(res, "res ");
  clients.add(res);

  sendToClient(res, "connected", {
    message: "Teacher connected to live events",
    activeClients: clients.size,
  });

  req.on("close", () => {
    clients.delete(res);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`SSE server running at http://localhost:${PORT}`);
});
