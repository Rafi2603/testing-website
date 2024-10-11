const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const { Pool } = require('pg');

// Setup PostgreSQL connection
const pool = new Pool({
    connectionString: 'postgresql://jmto_owner:saN4LcZbUQO9@ep-royal-snowflake-a1gudpyv.ap-southeast-1.aws.neon.tech/jmto?sslmode=require'
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

// Function to check database connection
async function checkDbConnection() {
    try {
        const client = await pool.connect(); // Try to connect to the database
        console.log('Connected to PostgreSQL database successfully!');
        await client.release(); // Release the connection after successful connection
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    }
}

// Call the function to check the connection
checkDbConnection();

// Display login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle login
app.post('/login', async (req, res) => {
    const { ruas, pass_ruas } = req.body;
    try {
        const result = await pool.query('SELECT * FROM akun_ruas WHERE ruas = $1', [ruas]);
        if (result.rows.length > 0) {
            const ruas = result.rows[0];
            if (pass_ruas === ruas.pass_ruas) {
                req.session.ruas_id = ruas.ruas_id;
                return res.redirect('/dashboard');
            }
        }
        res.send('Invalid username or password');
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Server error');
    }
});


// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
    if (req.session.ruas_id) { // ruas_id, bukan userId
        res.send('<h1>Hello World</h1>');
    } else {
        res.redirect('/');
    }
});


