const mongoose = require("mongoose")

const ProdutosSchama = new mongoose.Schema({
    titulo:{type:String, required:true, unique:false}, 
    descricao:{type:String, required:true, unique:false},
    imagem:{type:String }, 
    categoria:{type:Array }, 
    tamanho:{type:Array }, 
    cor:{type:Array },
    preco:{type:Number, required:true},
    stock:{type:Boolean, default:true },  
    activo:{type:Boolean , default:false},
    loja:{type:String, required:true},  
    id_loja:{type:String, required:true}, 
    novo:{type:String},
    quanti:{type:Number, default:0}
   

}, 
{timestamps:true}

)

module.exports = mongoose.model("Produtos", ProdutosSchama)