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

const Address=new Schema({
    state:{
        type:String
    },
    country:{
        type:String
    },
    district:{
        type:String
    },
    full_add:{
        type:String
    },
    state_code:{
        type:String
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
    home_location:Home,
    address:Address
},{
    timestamps:true
});

module.exports=mongoose.model('User',User);