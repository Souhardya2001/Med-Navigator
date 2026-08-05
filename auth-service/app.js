const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const PORT = 8000;
const userModel = require('./model/user_model');

// Middlewares

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.post('/create', function(req,res){
    const {email,password,name,age,username} = req.body
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async(err,hash)=>{
                 let createdUser = await userModel.create({
                 username,
                 email,
                 password:hash,
                 name:name,
                 age
                })
                res.send(createdUser)
            })
        })
});

app.post('/signin',async(req,res)=>{
    const {email,password,username} = req.body;
    let user = await userModel.findOne({email});
    if(!user){
        res.send('user not found');
        console.log('user not found');
    }
    else{
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                const token = jwt.sign({email,username},"shhhhhhh");
                res.cookie("token",token);
                res.send('user signed in successfully!');
            }
            else{
                res.send('password is incorrect');
                console.log('password is incorrect');
            }
        })
    }
});
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
app.get('/',(req,res)=>{
    console.log('auth-service is responding')
});
app.listen(PORT,()=>{
    console.log(`auth service is running on PORT: ${PORT}`);
});