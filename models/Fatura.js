const mongoose = require("mongoose")

const FaturaSchama = new mongoose.Schema({
    id_usuario:{type:String, required:true }, 
    nomeUsuario:{type:String, required:true }, 
    emailUsuario:{type:String, required:true },
    telefoneUsuario:{type:Number, required:true },
    produtos:[
        {
            id_produto:{type:String},
            id_loja:{type:String}, 
            titulo:{type:String}, 
            imagem_produto:{type:String}, 
            quantidade:{type:Number , default:1}, 
            loja:{type:String }, 
            codInter:{type:Number },
            preco:{type:String},
            estatus:{type:String, default:"Pendente"}
        }
    ], 

    motante:{type:Number, required:true}, 
    endereco:{type:String},
    estatosPedido:{type:String},
    estatos:{type:String, default:"Pendente"}
   
   

}, 
{timestamps:true}

)

module.exports = mongoose.model("Fatura", FaturaSchama)