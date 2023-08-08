const mongoose = require("mongoose");

const Pro_ientrSchema = new mongoose.Schema({
    id_intermediario:{type:String, required:true},
    codigoInter:{type:Number, required:true},
    nome_inter:{type:String, required:true},
    id_produto:{type:String , required:true},
    imagem_pro:{type:String, }, 
    titulo:{type:String, required:true}, 
    preco:{type:String, required:true}, 
    loja:{type:String, required:true}, 
    url_pro:{type:String, required:true}
}, {timestamps:true});

module.exports = mongoose.model("Pro_inter", Pro_ientrSchema);