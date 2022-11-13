const mongoose = require("mongoose")

const LojaSchama = new mongoose.Schema({
    nomeLoja :{type:String, required:true, unique:true},
    gerenteLoja :{type:String, required:false},
    nifLoja :{type:String, required:true},
    emailLoja :{type:String, required:true, unique:true},
    telefoneLoja :{type:Number, required:true, unique:true},
    enderecoLoja :{type:String, required:false},
    provinciaLoja :{type:String, required:false},
    municipioLoja :{type:String, required:false},
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
    
    descricao:{type:String, required:false}, 

    plano:{type:String, default:"pendente"}, 
    pagamento:{type:Number, default:0},
    estatuPagamento:{type:String, default:"Nem_um"},
    funcionamento:{type:String}
}, 
{timestamps:true}

)

module.exports = mongoose.model("Loja", LojaSchama)