const mongoose = require("mongoose")


const UserSchama = new mongoose.Schema({
    nomeCompleto :{type:String, required:true, unique:false},
    dataNascimento:{type:String, required:false},
    sexo:{type:String, required:false},
    numeroTelefone : {type:Number, required:true, unique:true},
    pais:{type:String, required:false},
    provincia : {type:String, required:false, unique:false},
    municipio : {type:String, required:false, unique:false},
    endereco :{type:String, required:false},
    email:{type:String, required:true, unique:true},
    nomeUsuario:{type:String, required:false, unique:false}, 
    password:{type:String , required:true}, 
    isAdmin:{
        type:Boolean, default:false , 
    },
    isUser:{
        type:Boolean, default:true , 
    },
    
    imagem:{type:String},
   
    intermediario : {type:String , default:"Não"},
    entregador : {type:String , default:"Não"},
    codigoInter : {type:Number,  default:0},
    codigoConfirm : {type:Number,  default:0},
    confirmado:{
        type:Boolean, default:false , 
    },
    confirmEmail:{
        type:Boolean, default:false , 
    },
    pontos:{type:Number, default: 5},
    produtosVendidos:{type:Number, default:0},
    login:{type:Boolean, default:false},
    logado:{type:Boolean, default:false},
    iban:{type:String, default:"Nem um"},
    bi:{type:String},
    kamba:{type:String, default:"Nem um"},
    convidado:{type:String},
}, 
{timestamps:true}

)

module.exports = mongoose.model("User", UserSchama)