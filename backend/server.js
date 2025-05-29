const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const fs = require('fs');


app.use(express.json());

const frontendPath = path.resolve(__dirname, '..'); // goes up from /backend to /projektest
app.use(express.static(frontendPath));

// API route to handle contact form
app.post('/api/contact', (req, res) => {
  const contactInfo = req.body;
  console.log('Received contact info:', contactInfo);
  res.json({ message: 'Contact info received!', data: contactInfo });
});

app.post('/api/save-message', (req, res) => { // save sent-message to data.json
    const { to, from, text, time } = req.body;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read data.json');

        const jsonData = JSON.parse(data);

        if (!jsonData.messages[to]) {
            jsonData.messages[to] = [];
        }

        jsonData.messages[to].push({ from, text, time });

        // Update lastMessage and time in contacts
        const contact = jsonData.contacts.find(c => c.name === to);
        if (contact) {
            contact.lastMessage = text;
            contact.time = time;
        }

        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).send('Failed to write to data.json');
            res.status(200).send('Message saved');
        });
    });
});

app.post('/api/save-message-reply', (req, res) => { // save reply-message to data.json
    const { from, text, time } = req.body;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read data.json');

        const jsonData = JSON.parse(data);

        if (!jsonData.messages[from]) {
            jsonData.messages[from] = [];
        }

        jsonData.messages[from].push({ from : 'them', text, time });

        // Update lastMessage and time in contacts
        const contact = jsonData.contacts.find(c => c.name === from);
        if (contact) {
            contact.lastMessage = text;
            contact.time = time;
        }

        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).send('Failed to write to data.json');
            res.status(200).send('Message saved');
        });
    });
});


// Fallback route for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
