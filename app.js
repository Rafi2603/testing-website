const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();  // Inisialisasi express app

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Setup PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Use CORS to allow requests from your frontend
app.use(cors({
    origin: 'https://testing-website-pied.vercel.app', // Allow this specific origin
    credentials: true // Allow cookies and other credentials
}));

// Parse incoming requests with JSON and URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Setup session with a memory store (default)
app.use(session({
    secret: 'secret-key', // Change to a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Secure only if using HTTPS (in production)
}));

// Display login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve static HTML page (Rekap Data Jagorawi)
app.get('/rekap-data-jagorawi.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/rekap-data-jagorawi.html'));
});

// Handle login
app.post('/login', async (req, res) => {
    // Destructure the values from the request body
    const { ruas, pass_ruas } = req.body;
    console.log('Received login attempt:', { ruas, pass_ruas });

    try {
        // Query the database for the user
        const result = await pool.query('SELECT * FROM akun_ruas WHERE ruas = $1', [ruas]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Check if the password matches
            if (pass_ruas === user.pass_ruas) {
                // Set session
                req.session.userId = user.ruas_id;

                // Send JSON response for successful login
                return res.json({
                    success: true,
                    ruas: user.ruas
                });
            } else {
                console.log('Incorrect password');
            }
        } else {
            console.log('User not found');
        }

        // Send 401 response for failed login attempts
        res.status(401).send('Invalid ruas or password');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Protected Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.userId) {
        res.send('<h1>Hello World</h1>');
    } else {
        res.redirect('/');
    }
});

// Export the Express app for use in serverless functions or elsewhere
module.exports = app;
