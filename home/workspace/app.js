var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Image = require("./models/image");
var multer=require("multer");
var app=express();
const port = 3000

mongoose.connect("mongodb://leonard:abcdefg123@ds141654.mlab.com:41654/mblog");

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'manipurblog', 
  api_key: 243547265737853, 
  api_secret: 'jGpb50uLfax0zfnj_8IEh1Jbhdo',
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine" , "ejs");

app.get("/",function(req,res){
   res.render("home");
});

app.get("/form",function(req,res){
    res.render("form");
});

app.post("/form",upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        
    req.body.name=result.secure_url;
    var name=req.body.name;
    
    var imagedetail={
        imageurl:name
    };
    
    Image.create(imagedetail,function(err,data){
       if (err){
           console.log(err);
           return res.redirect('back');
       }
       else{
          res.redirect("/images");
       }
    });
});
});

app.get("/images",function(req, res) {
    Image.find({}).exec(function(err,data){
        if(err){
            console.log(err);
        }
        else{
         res.render("images",{data:data}); 
        }
    });
});

// app.listen(process.env.PORT,process.env.IP,function(){
//    console.log("Server started"); 
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


