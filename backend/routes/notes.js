const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const fetchuser=require("../middlewares/fetchuser");
const Notes=require("../models/Notes");
const { body, validationResult } = require("express-validator");




//Route 1 to fetch all notes
router.get("/fetch",fetchuser,async (req,res)=>{
    const notes=await Notes.find({user:req.user.id});
    res.status(200).json(notes);
    
});



//Route 2 to add notes
router.post("/addnotes",fetchuser,[
    body('description').exists()
],async (req,res)=>{

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({err:errors.array()});
    }
    const {description}=req.body;
    const added=await Notes({
        user:req.user.id,
        description:description
    });
    const note=await added.save();

  res.status(200).json(note); 
    
    
});



//Route 3: delete note in user in database
router.delete("/delete/:id", fetchuser, async (req, res) => {
    const id = req.params.id;
    const note = await Notes.findById(id);
    //need to convert to string that user.id 
    if (!(note && note.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: "Not a valid user" });
    }
    const deletenote=await Notes.findByIdAndDelete(id);
    return res.status(200).json({deletednote:deletenote});
    
});

//Rute 4 : update note
router.put("/update/:id",fetchuser,[body("description").contains()],async (req,res)=>{
    let id=req.params.id;
    let note=await Notes.findById(id);
    if(req.user.id!=note.user.toString()){
        return res.status(400).send({msg:"invalid user"});
    }
    if(!note){
        return res.status(200).json({msg:"no record"});
    }
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors});
    }
    const {description}=req.body;
    let updatednote=await Notes.findByIdAndUpdate(id,{$set:{description:description}});
    res.status(200).json({updatednote});


})

module.exports=router;