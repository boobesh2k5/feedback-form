const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// EJS Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

// Data storage
const feedbacks = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {
  try {
    if (!req.body.name || !req.body.feedback || !req.body.rating) {
      throw new Error('Missing required fields');
    }
    
    feedbacks.push({
      name: req.body.name,
      feedback: req.body.feedback,
      rating: parseInt(req.body.rating),
      date: new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    
    res.redirect('/results');
  } catch (error) {
    console.error('Submission error:', error);
    res.status(400).send(`
      <h1>Error</h1>
      <p>${error.message}</p>
      <a href="/">← Back to form</a>
    `);
  }
});

app.get('/results', (req, res) => {
  try {
    res.render('feedback', { feedbacks });
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).send(`
      <h1>Server Error</h1>
      <p>We're having trouble displaying the results.</p>
      <a href="/">← Back to form</a>
    `);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server running at http://localhost:${PORT}
  
  Try these endpoints:
  - Form:      http://localhost:${PORT}
  - Results:   http://localhost:${PORT}/results
  `);
});