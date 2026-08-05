const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const PORT = 8000;
const userModel = require('./model/user_model');
const authController = require('./controllers/authController');
// Middlewares

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));


function isLoggedIn(req,res,next){
   try {
    let data = jwt.verify(req.cookies.token, "shhhhhhh");
    req.user = data;
    console.log(data);
} catch (err) {
    console.log(err);
    return res.redirect('/login');
}
    next();
}



app.post('/create', authController.signup);
app.post('/login',authController.login);
app.get('/logout',authController.logout);


app.listen(PORT,()=>{
    console.log(`auth service is running on PORT: ${PORT}`);
});