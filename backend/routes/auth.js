const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("../models/User");
const user = mongoose.model("user", userSchema);
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fetchuser=require("../middlewares/fetchuser");
require('dotenv').config();




//we use express validator because email is not mail it is string to make it email like that
//Route1:create user
router.post(
  "/createuser",
  //declaring validators
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    //checking validators
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //if validators got errors return and flow off
      return res.status(400).json({ msg: errors.array() });
    }
    //hasing using bcrypt
    let body = req.body;
    let salt = await bcrypt.genSalt(10);
    let hashpass = await bcrypt.hash(body.password, salt);
    const result = await user.create({
      name: body.name,
      email: body.email,
      password: hashpass,
    });
    res.status(200).json({ msg: "done" });
  }
);

//Route2:login user
//in route 2 we create jwt token for valid login 
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async(req, res) => {
    //signature for JWT
    const signature = process.env.signature;
    //validation using express validators
    let errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg:"invalid credentials make it valid"});
    }
    let {email,password}=req.body;
    let result=await user.findOne({email});
    if(result){
        let isttrue=await bcrypt.compare(password,result.password);
        //check hash and plaintext
        if(isttrue){
            const data={
                user:{
                    id:result.id
                }
            }
            const jwttoken=jwt.sign(data,signature);
            return res.status(200).json({authtoken:jwttoken});
        }
        return res.status(400).json({msg:"invalid cred"});
    }else{
        return res.status(400).json({msg:"invalid cred"});
    }
  }
);



//Route3 to get userdetails when jwt token is passed in header
router.post("/getuser", fetchuser,async (req, res) => {
  console.log("getuser fetched");        // Logs when this route is hit
  let id = req.user.id;
   let data=await user.findById(id).select("-password"); //selectiing all data except password                  
  res.status(200).json(data);            // Sends back the same data as JSON response
});



module.exports = router;
