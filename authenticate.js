const passport=require('passport');
var User=require('./models/users');
var jwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var GoogleStrategy=require('passport-google-oauth20').Strategy;
var jwt=require('jsonwebtoken');
require('dotenv').config();

exports.getToken=function(user){
    return jwt.sign(user,process.env.SECRET_KEY,{expiresIn:'12000000 days'});

};

var opts={};

opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=process.env.SECRET_KEY;

exports.jwtPassport=passport.use(new jwtStrategy(opts,(jwt_payload,done)=>{
    console.log(jwt_payload);
    User.findOne({_id:jwt_payload._id},(err,user)=>{
        if(err)
            return done(err,false);
        else if(user)
            return done(null,user);
        else
            return done(null,null);
    });
}));

exports.verifyUser=passport.authenticate('jwt',{session:false});

