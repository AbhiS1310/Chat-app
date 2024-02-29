const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const db  = require('./lib/db');
const cookieParser = require('cookie-parser');
const users = require('./routes/users');
require('dotenv').config();
db.Connect();

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(users);
app.get('/',async (req,res,next)=>{
    try {
        if(!req.cookies) return res.status(401).json({message: "please login"});
        const userid = jwt.verify(req.cookies.jwt,process.env.SECRET);
        if(!userid){
            return res.status(401).json({message: "token is expired"});
        } 
        return res.status(200);
    } catch (error) {
        return next(error);
    }
})
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})