const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
//usuario

dotenv.config() ; 

const verificaToken = (req, res, next) =>{
     const autHeader =  req.headers.token;
    if(autHeader){
        const token = autHeader.split(' ')[1]
         jwt.verify(token, process.env.JWT_SEC,(err, user)=>{
            if(err){ return res.status(403).json(err)}
            req.user = user
            next()
        })
    }else{
        return res.status(401).json({sms:"Porfavor faca o login"})
    }
}

const verificaTokenEautenticacao = (req, res, next)=>{
    verificaToken(req, res , ()=>{
        if(req.user.id === req.params.id|| req.user.isAdmin){
    next()
        }else{
            return res.status(403).json({sms:"Voce nao esta autorizado a entrar nesta pagina!"})
        }

    })

}

const verificaTokenEadmin = (req, res, next)=>{
    verificaToken(req, res  , ()=>{
        if(req.user.isAdmin){
           next()
        }else{
           return  res.status(403).json({sms:"Voce nao esta autorizado para entrar nesta pagina!!"})
        }

    })

}



//estabelecimento



const verificaTokenEstabelecimento = (req, res, next) =>{

    const autHeader = req.headers.token
    if(autHeader){
        const token = autHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err, loja)=>{
            if(err) res.status(403).json("token nao valido")
            req.loja = loja
            next()
        })
    }else{
        return res.status(401).json("Porfavor faca o login")
    }
}

const verificaTokenEautenticacaoEstabelecimento = (req, res, next)=>{

    verificaToken(req, res , ()=>{
        if(req.loja.id === req.params.id|| req.loja.autorizacao){
    next()
        }else{
            res.status(403).json("Voce nao esta autorizado a entrar nesta pagina!")
        }

    })

}

const verificaTokenEadminEstabelecimento = (req, res, next)=>{
    verificaToken(req, res  , ()=>{
        if(req.loja.autorizacao){
           next()
        }else{
            res.status(403).json("Voce nao esta autorizado para entrar nesta pagina!!")
        }

    })

}



module.exports = {
    verificaToken, 
    verificaTokenEautenticacao, 
    verificaTokenEadmin,
   verificaTokenEstabelecimento, 
    verificaTokenEautenticacaoEstabelecimento, 
    verificaTokenEadminEstabelecimento, 
    
}