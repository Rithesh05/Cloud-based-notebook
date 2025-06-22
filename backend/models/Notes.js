import { name } from 'ejs';
import mongoose from 'mongoose';
const { Schema } = mongoose;
const notesSchema = new Schema({
    description: {
        type: String,
        require:true
    },
   
    tag :{
        type: String
    },
    date : {
        type: Date,
        default : Date.now
}
});
module.exports=notesSchema;