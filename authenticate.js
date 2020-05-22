const passport=require('passport');
var User=require('./models/users');
var jwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');
var LocalStrategy=require('passport-local').Strategy;
var Admin=require('./models/admin');
require('dotenv').config();


exports.local = passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

exports.getToken=function(user){
    return jwt.sign(user,process.env.SECRET_KEY,{expiresIn:'12000000 days'});

};

var opts={};

opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken() ;
opts.secretOrKey=process.env.SECRET_KEY;

exports.jwtPassport=passport.use(new jwtStrategy(opts,(jwt_payload,done)=>{
   // console.log(jwt_payload);
        User.findOne({_id:jwt_payload._id},(err,user)=>{  
            if(err)
            { 
                Admin.findOne({_id:jwt_payload._id},(err,user)=>{
                    if(err)
                        return done(err,false);
                    else if(user)
                        return done(null,user);
                    else
                        return done(null,null);
                });
                
                return done(err,false);
            }
            else if(user)
                return done(null,user);
            else
                return done(null,null);
        });
    
   
      
    
 
}));

exports.verifyUser=passport.authenticate('jwt',{session:false});

exports.verifyMainAdmin=(req,res,next)=>{
    if(req.user.admin_type==='DC')
    {
        next();
    }
    else
    {
        let err=new Error('You are not authorized to perform this operation !');
        err.status=403;
        next(err);
    }
}

