const mongoose=require('mongoose');

var Schema=mongoose.Schema;

const Foreign=new Schema({
    googleId:{
        type:String,
        required:true,
        unique:true
    },
    latitude:{
        type:Number,
        required:true
    },
    longitude:{
        type:Number,
        required:true
    },
    accuracy:{
        type:Number,
        required:true
    },
    current_timestamp:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

module.exports=mongoose.model('Foreign',Foreign);