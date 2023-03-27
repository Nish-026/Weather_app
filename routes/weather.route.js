const express= require('express');
const weatherRouter= express.Router();
const {authMiddleware}=require("../middleware/authentication")
const client= require("../cache")
weatherRouter.get("/",authMiddleware,(req,res)=>{
    console.log("welcome")
})

weatherRouter.get("/:id",authMiddleware,async(req,res)=>{
    const city= req.params.id
        /////// City Name validator middleware/////////////
        for(let j=0;j<city.length;j++){
            if(typeof(city[j])=="number"||city[j]=="!"||city[j]=="@"||city[j]=="#"||city[j]=="$"||city[j]=="%"||city[j]=="^"||city[j]=="&"||city[j]=="*"||city[j]=="("||city[j]==")"){
                return res.send({"msg":"invalid city name"})
            }
        }

    
    console.log(req.user)
    const cacheKey= `${city}`
    await client.get(cacheKey, async(err,c_data)=>{
        if(err){
            console.log(err);
            res.send("internal server error")
        }
        if(c_data){
            console.log("yes")
            res.send(JSON.parse(c_data))
        }else{
            const API="1d505cd7992d7d67fe4e6157dbffbac6"
            let weather_data
            await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`).then((res)=>res.json()).then((data)=> weather_data=data)

            await client.set(cacheKey, JSON.stringify(weather_data),'EX', 1800,(err)=>{
                if(err){
                    console.log(err);
                    return res.send("internal server error")
                }
                res.send(weather_data)
            })


        
         }
    })
    



})

module.exports={
    weatherRouter
}