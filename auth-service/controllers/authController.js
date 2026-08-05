// Signup

exports.signup = async (req,res)=>{
    app.post('/signup', function(req,res){
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
}

//Signup

exports.signin = async (req,res)=>{
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
}

//Logout

exports.logout = async (req,res)=>{

}

//Profile

exports.profile = async (req,res)=>{

}