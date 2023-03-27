const jwt = require('jsonwebtoken');
require("dotenv").config();
const {User}=require("../models/user.model")
const client= require("../cache")
const authMiddleware = async(req, res, next) => {
    console.log("hey")
  try {
    
    const token = req.headers.authorization.split(' ')[1];
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