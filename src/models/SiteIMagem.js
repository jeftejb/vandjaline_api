const mongoose = require("mongoose")

const SiteIMagemSchama = new mongoose.Schema({
    imagems:{type:Array},
}, 
{timestamps:true}

)

module.exports = mongoose.model("SiteIMagem", SiteIMagemSchama)