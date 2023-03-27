const express= require("express")
require("dotenv").config()
const {userRouter}= require("./routes/user.route")
const expressWinston = require('express-winston');
const winston= require('winston')
const {weatherRouter}= require("./routes/weather.route")
const {connection}= require("./db")
require("winston-mongodb")
const app= express();
app.use(express.json());

////// for logging ///////
app.use(expressWinston.logger({
    statusLevels: true,
    transports: [
      new winston.transports.Console({
        level: "error",
        json: true
      }),
      new winston.transports.MongoDB({
        level:"info",
        db: "mongodb://127.0.0.1:27017/march27logs",
        json: true,
      })
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  }));

app.get("/",(req,res)=>{
    res.send({"msg":"welcome"})
})
app.use("/user",userRouter)
app.use("/weather",weatherRouter)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("connected to db")
    }catch(err){
        console.log(err)
    }
    console.log("server is running")
})

