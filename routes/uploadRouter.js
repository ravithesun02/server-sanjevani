const express=require('express');
const bodyparser=require('body-parser');
const authenticate=require('../authenticate');
const multer=require('multer');

const uploadRouter=express.Router();

uploadRouter.use(bodyparser.json());

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }

});

const imageFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
        return cb(new Error('You can only upload Images'),false);
    cb(null,true);
};

const upload=multer({
    storage:storage,
    fileFilter:imageFilter
});

uploadRouter.route('/')
.get((req,res,next)=>{
    res.statusCode=403;
    res.setHeader('Content-Type','text/plain');
    res.end('GET is not allowed');
})
.post(authenticate.verifyUser,upload.single('imageFile'),(req,res)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.setHeader('Content-Type','text/plain');
    res.end('PUT is not allowed');
})
.delete((req,res,next)=>{
    res.statusCode=403;
    res.setHeader('Content-Type','text/plain');
    res.end('DELETE is not allowed');
});

module.exports=uploadRouter;