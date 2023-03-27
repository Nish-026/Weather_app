const express= require('express');
const userRouter= express.Router();
const bcrypt= require('bcrypt');
require('dotenv').config()
const jwt= require("jsonwebtoken");
const {User}= require("../models/user.model")


userRouter.post("/signup",async(req,res,next)=>{
    try{
        const {email,password}= req.body
    

    const hashed_password= bcrypt.hashSync(password,8)
    const user= new User({email, password: hashed_password})
    await user.save()
    res.json({message:"user created succesfully"})
    } catch(err){
        next(err)
    }
})


userRouter.post("/login",async(req,res,next)=>{
    try{
        const {email,password}= req.body;
        console.log(req.body)
        const user= await User.findOne({email});
        if(!user){
            return res.status(401).json({message:'invalid username and password'})
        }
        const ispasswordMatch= await bcrypt.compare(password, user.password);
        if(!ispasswordMatch){
            return res.status(401).json({message:'invalid username and password'})
        }
        const token= jwt.sign({userId:user._id}, process.env.JWT_SECRET,{
            expiresIn: "1h"
        })
        res.json({msg:"login succesful",token})
    }catch(err){
        res.send(err.message)
    }
})

module.exports={
    userRouter
}