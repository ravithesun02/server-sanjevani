var express = require('express');
var UserRouter = express.Router();
var authenticate=require('../authenticate');
const User=require('../models/users');
var google=require('googleapis').google;
var oauth2=google.auth.OAuth2;
var oauth2Client=new oauth2();
const fetch=require('node-fetch');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

/* GET users listing. */

UserRouter.route('/login')
.get(authenticate.verifyUser,(req,res,next)=>{
  User.findById(req.user._id)
  .then((user)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json({status:'success',user:user});
  },(err)=>console.log(err))
  .catch((err)=>next(err))

})
.post((req,res,next)=>{
  if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer')
  {
    let id_token=req.headers.authorization.split(' ')[1];
    client.verifyIdToken({idToken:id_token})
    .then((ticket)=>{
      let response=ticket.getPayload();
      //console.log(response);
      User.findOne({'googleId':response.sub},(err,user)=>{
        if(err)
           next(err);
        else if(err ==null && user !=null)
        {
          // console.log(response.aud);
          // console.log("logged in");
          let token=authenticate.getToken({_id:user._id});
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json({status:0,user:user,token:token});
        }
        else if(user==null)
        {
          let userdata={
            'googleId':response.sub,
            'email':response.email,
            'first_name':response.given_name,
            'last_name':response.family_name,
            'profile_pic':response.picture
          };
          User.create(userdata)
          .then((user)=>{
           // console.log("Signed up");
           let token=authenticate.getToken({_id:user._id});
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({status:1,user:user,token:token});
          },(err)=>console.log(err))
          .catch((err)=>next(err));
          
        }
      })

    })
    .catch((err)=>next(err))
  }
  else
  {
    res.statusCode=401;
    res.setHeader('Content-Type','application/json');
    res.json({status:'failed',code:-1});
  }
})

.put(authenticate.verifyUser,(req,res,next)=>{
  if(req.body.home_location.longitude)
    {
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${req.body.home_location.latitude}+${req.body.home_location.longitude}&key=7a38a82ec3ad4b33a43514cd8254b437`)
      .then(response=>{
        if(response.ok)
          return response;
        else
        {
          var err=new Error(response.message);
        }
      })
      .then((response)=>response.json())
      .then((data)=>{
        req.body.address.state=data.results[0].components.state;
        req.body.address.country=data.results[0].components.country;
        req.body.address.district=data.results[0].components.state_district;
        req.body.address.full_add=data.results[0].formatted;
        req.body.address.state_code=data.results[0].components.state_code;
      })
      .catch((err)=>{console.log(err)});
    }
  User.findByIdAndUpdate({_id:req.user._id},req.body,{new : true})
  .then((user)=>{
    
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json({status:'success',user:user});
  },(err)=>console.log(err))
  .catch((err)=>next(err))
  
})


module.exports = UserRouter;
