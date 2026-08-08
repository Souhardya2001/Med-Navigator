const express = require('express');
const app = express();
require("dotenv").config({
    path: "../.env"
});
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const userModel = require('./model/user_model');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const PORT = process.env.PORT;

//Connect to Database
connectDB();
 

// Middlewares

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));


app.use('/api/auth', authRoutes);


app.listen(PORT,()=>{
    console.log(`auth service is running on PORT: ${PORT}`);
});