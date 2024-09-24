
const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require("./routes/authrouts");
const homepageroutes = require("./routes/homepagerouts");
const adminhome = require("./routes/adminrotes/adminrouts");
const app = express();

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/ECOM', {})
    .then(() => {
        console.log('Mongodb connected');
    })
    .catch((error) => {
        console.error('Error connecting to Mongodb:', error);
    });

// Setting the directory for view templates
app.set('views', path.join(__dirname, 'views'));
// Setting EJS as the view engine
app.set('view engine', 'ejs');

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Configuring express-session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if you are using HTTPS
}));

// Using the routes from the routes file
//user routs
app.use("/",homepageroutes);
app.use('/', authRoutes);


//adminrouts
app.use("/",adminhome);

// Starting the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
