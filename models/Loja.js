const mongoose = require("mongoose")

const LojaSchama = new mongoose.Schema({
    nomeLoja :{type:String, required:true, unique:true},
    gerenteLoja :{type:String, required:true},
    nifLoja :{type:String, required:true},
    emailLoja :{type:String, required:true, unique:true},
    telefoneLoja :{type:Number, required:true, unique:true},
    enderecoLoja :{type:String, required:true},
    provinciaLoja :{type:String, required:true},
    municipioLoja :{type:String, required:true},
    actuacao :{type:String, required:true},
    password :{type:String , required:true}, 
    ativo:{
        type:Boolean, default:false , 
    },
    isAdmin:{
        type:Boolean, default:true,
    },
    isUser:{
        type:Boolean, default:false , 
    },
    autorizacao:{
        type:Boolean, default:false , 
    },
    kamba:{
        type:String ,
    },
    
    imagem:{type:String},
    
    descricao:{type:String, required:true}, 

    plano:{type:String, default:"pendente"}, 
    pagamento:{type:Number, default:0},
    estatuPagamento:{type:String, default:"Nem_um"},
    funcionamento:{type:String}
}, 
{timestamps:true}

)

module.exports = mongoose.model("Loja", LojaSchama)