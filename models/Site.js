const mongoose = require("mongoose")

const SiteSchama = new mongoose.Schema({
    nome:{type:String},
    so:{type:String},
    descSite:{type:String},  
    descSlideF:{type:String},  
    descSlideS:{type:String},
    telefone:{type:Array},
    localizacao:{type:String},
    email:{type:Array},  

   
}, 
{timestamps:true}

)

module.exports = mongoose.model("Site", SiteSchama)