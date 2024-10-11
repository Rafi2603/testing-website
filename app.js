const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Pool } = require('pg');

// Setup PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Setup session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Serve static files (CSS)
app.use(express.static('public'));

// Display login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
        const user = result.rows[0];
        if (password === user.password) { // Direct comparison without bcrypt
            req.session.userId = user.id;
            return res.redirect('/dashboard');
        }
    }
    res.send('Invalid username or password');
});

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
    if (req.session.userId) {
        res.send('<h1>Hello World</h1>');
    } else {
        res.redirect('/');
    }
});

// Export the Express app
module.exports = app;
