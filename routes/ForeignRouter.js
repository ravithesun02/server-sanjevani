var express=require('express');

var ForeignRouter=express.Router();
var authenticate=require('../authenticate');
var Foreign=require('../models/foreign');
const fetch=require('node-fetch');

ForeignRouter.route('/foreign')
.get(authenticate.verifyUser,(req,res)=>{

})
.post(authenticate.verifyUser,(req,res,next)=>{
    req.body.googleId=req.user.googleId;
   Foreign.create(req.body)
   .then((location)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json({status:'success',code:1});
   },(err)=>console.log(err))
   .catch((err)=>next(err))

})
.put(authenticate.verifyUser,(req,res,next)=>{
    Foreign.findOneAndUpdate({'googleId':req.user.googleId},req.body)
    .then((location)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'success',code:0});
    },(err)=>console.log(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Foreign.findOneAndDelete({'googleId':req.user.googleId})
    .then((data)=>{
        console.log(data);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'success',code:2});
    },(err)=>console.log(err))
    .catch((err)=>next(err))
});

module.exports=ForeignRouter;