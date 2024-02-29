const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const SaltRounds = 12;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate:{
            validator: emailValidator.validate,
            message: "Please enter Valid email address!"
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 8
    },
    gender:{
        type: String,
        enum: "Male" || "Female"
    }
},{timestamps: true});

userSchema.pre("save", async function preSave(next){
    try{
        this.password = await bcrypt.hash(this.password,SaltRounds);
        return next();

    }catch(err){
        return next(err);
    }
})

userSchema.methods.ComparePassword = async function ComparePassword(password){
    return bcrypt.compare(password,this.password);
}

userSchema.methods.authToken = async function authToken(){
    const token = jwt.sign({userId:this._id},process.env.SECRET,{expiresIn:'1s'});
    return token;
}

module.exports = mongoose.model('user',userSchema);