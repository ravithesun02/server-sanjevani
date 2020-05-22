var passportLocalMongoose=require('passport-local-mongoose');
var mongoose=require('mongoose');

var Schema=mongoose.Schema;

const Admin=new Schema({
    state:{
        type:String
    },
    district:{
        type:String
    },
    admin_type:{
        type:String
    },
    latitude:{
        type:Number
    },
    longitude:{
        type:Number
    }
});

Admin.plugin(passportLocalMongoose);

module.exports=mongoose.model('admin',Admin);