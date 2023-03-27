const jwt = require('jsonwebtoken');
require("dotenv").config();
const {User}=require("../models/user.model")
const client= require("../cache")
const authMiddleware = async(req, res, next) => {
    console.log("hey")
  try {
    const array= await client.lRange("blacklist",0,-1);
    const token = req.headers.authorization.split(' ')[1];
    array=JSON.parse(array);
    if(array.includes(token)){
        return res.send({"msg":"please log in again"})
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decodedToken);
    const { userId } = decodedToken;
    // console.log(decodedToken)
    req.body.user=decodedToken.userId
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach the user to the request object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized',err:error.message});
  }
};

module.exports = {authMiddleware};