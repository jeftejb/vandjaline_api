const mongoose  = require("mongoose")


const CategoriaSchema = new mongoose.Schema({
    imagemCat:{type:String},    
    nomeCat:{type:String, required:true},

}, {timestamps:true}

)

module.exports = mongoose.model("Categorias", CategoriaSchema)