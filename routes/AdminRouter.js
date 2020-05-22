var express=require('express');
var authenticateAdmin=require('../authenticate');
var Admin=require('../models/admin');
var passport=require('passport');
var bodyparser=require('body-parser');
var fetch=require('node-fetch');
var cors=require('./cors');


var AdminRouter=express.Router();

AdminRouter.use(bodyparser.json());

AdminRouter.route('/signup')
.post(cors.cors,(req,res,next)=>{
    Admin.register(new Admin({username:req.body.username}),req.body.password,async(err,user)=>{
        if(err)
        {
            res.statusCode=500;
            res.setHeader('Content-Type','application/json');
            res.json({err:err});
        }
        else
        {
            let location={};
            try{

                let res=await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${req.body.district.toUpperCase()},${req.body.state.toUpperCase()}&key=7a38a82ec3ad4b33a43514cd8254b437`);
                if(res.ok)
                {
                    let data=await res.json();
                    location.latitude=data.results[0].geometry.lat;
                    location.longitude=data.results[0].geometry.lng;
                }
            }
            catch(error)
            {
                console.log(error);
            }
            user.latitude=location.latitude;
            user.longitude=location.longitude;
            user.state=req.body.state;
            user.district=req.body.district;
            user.admin_type=req.body.admin_type;

            user.save((err,user)=>{
                if(err)
                {
                  res.statusCode=500;
                  res.setHeader('Content-Type','application/json');
                  res.json({err:err});
                  return ; 
                }
                 
                passport.authenticate('local')(req,res,()=>{
                  res.statusCode=200;
                  res.setHeader('Content-Type','application/json');
                  res.json({success:true,status:'Registration successful'});
                })
            })
        }
    })
});

AdminRouter.route('/login')
.post(cors.corsWithOptions,passport.authenticate('local'),(req,res)=>{
    let token=authenticateAdmin.getToken({_id:req.user._id});

    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json({success:true,Token:token,status:'Logged In',admin_type:req.user.admin_type,latitude:req.user.latitude,longitude:req.user.longitude});
});

module.exports=AdminRouter; 

