const mongoose = require("mongoose")

const UserSchama = new mongoose.Schema({
    nomeCompleto :{type:String, required:true, unique:false},
    dataNascimento:{type:String, required:true},
    sexo:{type:String, required:true},
    numeroTelefone : {type:Number, required:true, unique:true},
    pais:{type:String, required:true},
    provincia : {type:String, required:true, unique:false},
    municipio : {type:String, required:true, unique:false},
    endereco :{type:String, required:true},
    email:{type:String, required:true, unique:true},
    nomeUsuario:{type:String, required:true, unique:true}, 
    password:{type:String , required:true}, 
    isAdmin:{
        type:Boolean, default:false , 
    },
    isUser:{
        type:Boolean, default:true , 
    },
    
    imagem:{type:String},
   
    intermediario : {type:String , default:"Nao"},
    entregador : {type:String , default:"Nao"},
    codigoInter : {type:Number,  default:0},
    codigoConfirm : {type:Number,  default:0},
    confirmado:{
        type:Boolean, default:false , 
    },
    confirmEmail:{
        type:Boolean, default:false , 
    },
    pontos:{type:Number},
    produtosVendidos:{type:Number},
    login:{type:Boolean, default:false},
    logado:{type:Boolean, default:false},
    iban:{type:String},
    kamba:{type:String},
}, 
{timestamps:true}

)

module.exports = mongoose.model("User", UserSchama)