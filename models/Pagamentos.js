const mongoose = require("mongoose")

const PagamentosSchama = new mongoose.Schema({
    id_usuario:{type:String, required:true }, 
    nomeUsuario:{type:String},
    valor:{type:Number},
    estatos:{type:String, default:"Pendente"},
    iban:{type:String},
    kamba:{type:String},
    telefone:{type:String}
}, 
{timestamps:true}

)

module.exports = mongoose.model("Pagamentos", PagamentosSchama)