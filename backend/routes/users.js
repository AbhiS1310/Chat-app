const express = require('express');
const userModel = require('../models/userModel');

const jwt = require('jsonwebtoken');
const router = express.Router();


router.post('/sign-up',async (req,res,next)=>{
    try {
        console.log(req.body);
        const user = await userModel.findOne({username: req.body.username});
        if(user)  return res.status(401).json({message: "User already exists"});
        const newUser = new userModel({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        await newUser.save();
        return res.status(200).json({message:"User created successfuly..."});

    } catch (error) {
        return next(error);
    }
})

router.post('/login',async (req,res,next)=>{
    try {
        const user = await userModel.findOne({username:req.body.username});
        if(!user){
            return res.status(401).json({message: "username or password is incorrect"});
        }
        if(! await user.ComparePassword(req.body.password)){
            return res.status(401).json({message: "username or password is incorrect"});
        }
        // user.password = "";
        const token = await user.authToken();
        console.log(token);
        res.cookie('jwt', token);
        return res.status(200).json({message: "Logged in successfully"});
    } catch (error) {
        return next(error);
    }
})


router.get('/',async (req,res,next)=>{
    try {
        // console.log(req.cookies);
        if(!req.cookies.jwt) return res.status(401).json({message: "please login"});
        const userid = jwt.verify(req.cookies.jwt,process.env.SECRET);
        console.log(userid);
        if(!userid){
            return res.status(401).json({message: "token is expired"});
        } 
        return res.status(200).json({message:"hh"});
    } catch (error) {
        return res.status(401).json({message:"token is expired"});
    }
})


module.exports = router;