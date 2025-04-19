const express = require('express');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const port = 8000;

// In-memory store for tracking links
const trackingLinks = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to create a new tracking link with optional label
app.post('/create-link', (req, res) => {
  const id = nanoid(10);
  const label = req.body.label || 'No label provided';
  trackingLinks.set(id, { createdAt: new Date(), label });
  const trackingUrl = req.protocol + '://' + req.get('host') + '/track/' + id;
  res.json({ trackingUrl });
});

// Tracking endpoint to capture and display visitor IP and label
app.get('/track/:id', (req, res) => {
  const id = req.params.id;
  if (!trackingLinks.has(id)) {
    return res.status(404).send('Tracking link not found');
  }
  const visitorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { label } = trackingLinks.get(id);
  res.send('<h1>Tracking Link: ' + id + '</h1><p>Label: ' + label + '</p><p>Your IP address is: ' + visitorIp + '</p>');
});

app.listen(port, () => {
  console.log('Tracking server running at http://localhost:' + port);
});
