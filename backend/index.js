const main=require("./db");
const express=require("express");
const app=express();
const port=3000;
main();


//middleware
app.use(express.json());
//routes
app.use("/api/auth",require("./routes/auth"))

app.get("/",(req,res)=>{
    res.send("hii");
})
app.listen(3000,(req,res)=>{
    console.log("listening in 3000");
})