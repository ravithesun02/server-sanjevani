const mongoose=require('mongoose');

var Schema=mongoose.Schema;

const Home=new Schema({
    latitude:{
        type:Number
    },
    longitude:{
        type:Number
    }
});

const User=new Schema({
    googleId:{
        type:String,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    occupation:{
        type:String,
        required:false
    },
    mobile:{
        type:Number,
        required:false
    },
    newid:{
        type:Boolean,
        default:true
    },
    profile_pic:{
        type:String,
        required:false
    },
    home_location:Home
},{
    timestamps:true
});

module.exports=mongoose.model('User',User);