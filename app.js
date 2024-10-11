const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();  // Inisialisasi express app di sini

// Setup PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Menggunakan CORS
app.use(cors({
    origin: 'https://testing-website-rafi-fauzans-projects.vercel.app'  // Batasi hanya ke domain frontend Anda
}));

app.use(bodyParser.urlencoded({ extended: true }));

// Setup session with memory store (default)
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Serve static files (CSS)
app.use(express.static('public'));

// Display login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle login
app.post('/login', async (req, res) => {
    const { ruas, pass_ruas } = req.body;
    
    // Query untuk mencari ruas di database
    const result = await pool.query('SELECT * FROM akun_ruas WHERE ruas = $1', [ruas]);

    if (result.rows.length > 0) {
        const user = result.rows[0];

        // Cek apakah password yang diinputkan sesuai dengan pass_ruas di database
        if (pass_ruas === user.pass_ruas) {
            req.session.userId = user.ruas_id;  // Set session berdasarkan ruas_id
            
            // Kirim response JSON jika login berhasil
            return res.json({
                success: true,
                ruas: user.ruas // Misalnya mengembalikan ruas
            });
        }
    }
    res.status(401).send('Invalid ruas or password');
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
