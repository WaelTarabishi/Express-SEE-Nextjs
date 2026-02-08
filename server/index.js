const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'express-sse-server' });
});

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.flushHeaders();

  let count = 0;

  const sendEvent = () => {
    count += 1;

    const payload = {
      id: count,
      message: `Event #${count} from Express SSE`,
      time: new Date().toISOString()
    };

    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  sendEvent();
  const interval = setInterval(sendEvent, 2000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`SSE server running at http://localhost:${PORT}`);
});
