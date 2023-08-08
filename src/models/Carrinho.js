const mongoose = require("mongoose")

const CarrinhoSchama = new mongoose.Schema({
    id_usuario:{type:String, required:true }, 
    produtos:[
        {
            id_produto:{type:String}, 
            quantidade:{type:Number , default:1}, 
        }
    ]
   
   

}, 
{timestamps:true}

)

module.exports = mongoose.model("Carrinho", CarrinhoSchama)