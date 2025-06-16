const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(express.json());

const frontendPath = path.resolve(__dirname, '..'); 
app.use(express.static(frontendPath));

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root', 
  password: 'password', 
  database: 'hearchat'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API route to handle contact form
app.post('/api/contact', (req, res) => {
  const contactInfo = req.body;
  console.log('Received contact info:', contactInfo);
  res.json({ message: 'Contact info received!', data: contactInfo });
});

// Get All Data (user + contacts)
app.get('/api/get-all-data', (req, res) => {
    const userQuery = 'SELECT * FROM users LIMIT 1';
    const contactsQuery = 'SELECT * FROM contacts';

    db.query(userQuery, (err, userResults) => {
        if (err) return res.status(500).send(err);
        const user = userResults[0];

        db.query(contactsQuery, (err, contactResults) => {
            if (err) return res.status(500).send(err);

            const contacts = contactResults.map(contact => ({
                name: contact.name,
                avatar: contact.avatar,
                status: contact.status,
                lastMessage: contact.last_message,
                time: contact.time,
                unread: contact.unread
            }));

            res.json({ user, contacts });
        });
    });
});

// Get Messages For Specific Contact
app.get('/api/get-messages', (req, res) => {
    const contactName = req.query.name;

    const getContactId = 'SELECT id FROM contacts WHERE name = ?';
    db.query(getContactId, [contactName], (err, contactResult) => {
        if (err) return res.status(500).send(err);
        if (!contactResult.length) return res.status(404).send('Contact not found');

        const contactId = contactResult[0].id;

        const getMessages = 'SELECT sender, text, time FROM messages WHERE contact_id = ?';
        db.query(getMessages, [contactId], (err, messageResults) => {
            if (err) return res.status(500).send(err);

            const messages = messageResults.map(m => ({
                from: m.sender === 'me' ? 'me' : 'them',
                text: m.text,
                time: m.time
            }));

            res.json(messages);
        });
    });
});


// Save new message
app.post('/api/save-message', (req, res) => {
  const { to, from, text, time } = req.body;

  // Get contact id based on name
  db.query('SELECT id FROM contacts WHERE name = ?', [to], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send('Contact not found');
    }
    const contactId = results[0].id;

    db.query('INSERT INTO messages (contact_id, sender, text, time) VALUES (?, ?, ?, ?)', 
      [contactId, from, text, time], (err) => {
        if (err) return res.status(500).send('Failed to insert message');

        db.query('UPDATE contacts SET last_message = ?, time = ? WHERE id = ?', [text, time, contactId], (err) => {
          if (err) return res.status(500).send('Failed to update contact');
          res.status(200).send('Message saved');
        });
      });
  });
  console.log('success saving')
});

// Save reply message
// app.post('/api/save-message-reply', (req, res) => {
//   const { from, text, time } = req.body;

//   db.query('SELECT id FROM contacts WHERE name = ?', [from], (err, results) => {
//     if (err) {
//       console.error('SQL error:', err);
//       return res.status(500).send('Internal server error');
//     }
//     if (results.length === 0) {
//       console.warn('Contact not found for name:', from);
//       return res.status(404).send('Contact not found');
//     }

//     const contactId = results[0].id;

//     db.query('INSERT INTO messages (contact_id, sender, text, time) VALUES (?, ?, ?, ?)', 
//       [contactId, 'them', text, time], (err) => {
//         if (err) {
//           console.error('Insert reply error:', err);
//           return res.status(500).send('Failed to insert reply');
//         }

//         db.query('UPDATE contacts SET last_message = ?, time = ? WHERE id = ?', [text, time, contactId], (err) => {
//           if (err) {
//             console.error('Update contact error:', err);
//             return res.status(500).send('Failed to update contact');
//           }
//           res.status(200).send('Reply saved');
//         });
//       });
//   });
// });

// Fallback route for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
