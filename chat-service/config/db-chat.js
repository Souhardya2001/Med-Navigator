const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
       
        await mongoose.connect(process.env.MONGO_URI_CHAT);
        console.log("MongoDB Connected");
    }
    catch(err){
        console.log(process.env.MONGO_URI_CHAT);
        console.log(err);
    }
}

module.exports = connectDB;
