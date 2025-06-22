const mongoose=require("mongoose");
const URL="mongodb://localhost:27017/notebook";
const main=async ()=>{
    await mongoose.connect(URL);
    console.log("connected");
}

module.exports=main;