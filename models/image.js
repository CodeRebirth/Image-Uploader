var mongoose=require("mongoose");

var imageSchema = new mongoose.Schema({
   imageurl:String,
});


module.exports=mongoose.model("Image",imageSchema);