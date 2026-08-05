mongoose = require('mongoose')
mongoose.connect(`mongodb://localhost:27017/user-auth-mongodb`)

const userSchema = mongoose.Schema({
    email : String,
    username: String,
    password : String,
    name : String,
    age : String,
    resetOtp: String,
    otpExpiry: Date,
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : 'post'
        }
    ]
});

module.exports = mongoose.model('user',userSchema)