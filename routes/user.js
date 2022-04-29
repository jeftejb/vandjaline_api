const {verificaToken ,verificaTokenEautenticacao, verificaTokenEadmin } = require("./verificaToken");
const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();

//atualizar

router.put("/:id",verificaToken,async (req , res)=>{

 if(req.body.pontos){
    try{
        const user  = await User.findById(req.params.id)
        const pontosAct =  user?.pontos ? user?.pontos + req.body.pontos : req.body.pontos
        const prov = user?.produtosVendidos ? user?.produtosVendidos + req.body.produtosVendidos : req.body.produtosVendidos
        const dados = {pontos:pontosAct, produtosVendidos:prov}
        const updateUsuario = await User.findByIdAndUpdate(req.params.id, {
            $set:dados
        } , {new:true})
        res.status(200).json(updateUsuario)
    }catch(err){res.status(500).json({err})}
}else{
    
try{
   
    const updateUsuario = await User.findByIdAndUpdate(req.params.id, {
        $set:req.body
    } , {new:true})
    res.status(200).json(updateUsuario)
}catch(err){res.status(500).json({err})}
}
})

// actualizar passe 

router.put("/mudar/pass/" , async (req, res)=>{
  
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SEC
            ).toString()
         
            const dados = {password : req.body.password}
            console.log(dados)
            try{
       
                const updateUsuario = await User.findOneAndUpdate({email:req.body.email} , {
                    $set:dados
                } , {new:true})
                res.status(200).json(updateUsuario)
            }catch(err){res.status(500).json({err})}
    
    
})

//actualizar estado logado 
router.put("/log/:id" , async (req , res)=>{
try{
   
    const updateUsuario = await User.findByIdAndUpdate(req.params.id, {
        $set:req.body
    } , {new:true})
    res.status(200).json(updateUsuario)
}catch(err){res.status(500).json({err})}
})
//atualizar Pagamento

router.put("/pagamento/:id", verificaToken, async (req , res)=>{
  
        try{
            const user  = await User.findById(req.params.id)
            if(Number(user?.pontos)< req.body.pontos ){
                res.status(401).json("Dinheiro insuficinete")
            }
            const pontosAct =   Number(user?.pontos) - req.body.pontos 
            const dados = {pontos:pontosAct}
            const updateUsuario = await User.findByIdAndUpdate(req.params.id, {
                $set:dados
            } , {new:true})
            res.status(200).json(updateUsuario)

        }catch(err){res.status(500).json({err})}
    })
      
    

//Delete usuario

router.delete("/:id", verificaTokenEautenticacao, async (req, res)=>{
try{
await User.findByIdAndDelete(req.params.id)
res.status(200).json("usuario deletado com sucesso!")
}catch(err){
    res.status(500).json({err})
}
})


//Buscar usuario

router.get("/:id", async (req, res)=>{
    try{
    const user = await User.findById(req.params.id)
    const {password, ...others} = user._doc
    res.status(200).json(others)
    }catch(err){
        res.status(500).json({err})
    }
    })


    //Buscar todos  usuarios

router.get("/", verificaTokenEadmin, async (req, res)=>{
    const query = req.query.new
    try{
    const users  = query ? await User.find().sort({createdAt:-1}).limit(5) : await User.find()
    res.status(200).json(users)
    }catch(err){
        return res.status(500).json({err})
    }
    })

    //stato usuarios 

    router.get("/stato/log", async (req, res)=>{
const date = new Date();
const ultimoAno= new Date(date.setFullYear(date.getFullYear() -1 ))
try{
const data = await User.aggregate([
    {$match:{createdAt:{$gte: ultimoAno}}},
    {
        $project:{
            month: {$month:"$createdAt"}
        }
    }, 
    {
        $group:{
            _id:"$month", 
            total: {$sum : 1}, 
        }
    }
])

res.status(200).json(data)
}catch(err){
    res.status(500).json({err})
}
    })

module.exports = router;