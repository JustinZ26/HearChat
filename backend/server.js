const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;


app.use(express.json());

const frontendPath = path.resolve(__dirname, '..'); // goes up from /backend to /projektest
app.use(express.static(frontendPath));

// API route to handle contact form
app.post('/api/contact', (req, res) => {
  const contactInfo = req.body;
  console.log('Received contact info:', contactInfo);
  res.json({ message: 'Contact info received!', data: contactInfo });
});

// Fallback route for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
