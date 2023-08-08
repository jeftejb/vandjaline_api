const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const Loja = require("../models/Loja");
const {verificaToken, verificaTokenEautenticacao, verificaTokenEadmin } = require("./verificaToken")
const CryptoJS = require("crypto-js");
const {sleep}  = require("./temporizador");

const tempo = 3000;
//atualizar Estabelecimento

router.put("/:id",verificaTokenEadmin, async (req , res)=>{
    sleep(tempo)
if(req.body.password){
    req.body.password = CryptoJS.AES.encrypt(
        req.body.password, process.env.PASS_SEC
        ).toString()
}
try{
    const updateLoja = await Loja.findByIdAndUpdate(req.params.id, {
        $set:req.body
    } , {new:true})
    res.status(200).json(updateLoja)
}catch(err){res.status(500).json({err})}
})

//actualizar pagamnto e plano 


router.put("/update/pacote/:id" , async (req, res)=>{
    sleep(tempo)
    try{
        const updateLoja = await Loja.findByIdAndUpdate({_id: String(req.params.id)}, {
            $set:req.body
        } , {new:true})
        res.status(200).json(updateLoja)
    }catch(err){res.status(500).json({err})}
})



// actualizar passe estabelecimento

router.put("/mudar/pass/loja" , async (req, res)=>{

    sleep(tempo)
  
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SEC
            ).toString()
         
            const dados = {password : req.body.password}
            console.log(dados)
            try{
       
                const updateUsuario = await User.findOneAndUpdate({emailLoja:req.body.email} , {
                    $set:dados
                } , {new:true})
                res.status(200).json(updateUsuario)
            }catch(err){res.status(500).json({err})}
    
    
})

//Delete estabelecimento

router.delete("/:id", verificaTokenEadmin, async (req, res)=>{
try{
    await Loja.findByIdAndDelete(req.params.id)
res.status(200).json("Estabelecimento deletado com sucesso!")
}catch(err){
    res.status(500).json({err})
}
})


//Buscar estabelecimento

router.get("/:id", async (req, res)=>{
    try{
    const loja  = await Loja.findById(req.params.id)
    const {password, ...others} = loja._doc
    res.status(200).json(others)
    }catch(err){
        res.status(500).json({err})
    }
    })

    //Buscar todos  estabelecimentos - admin

router.get("/" , async (req, res)=>{
   
    try{
         const  loja = await Loja.find()
    res.status(200).json(loja)
    }catch(err){
        res.status(500).json({err})
    }
    })


    //busca email loja 


    router.get("/find/email/:email" , async (req, res)=>{
    
        try{
            const  loja = await Loja.findOne({emailLoja : req.params.email})
       res.status(200).json(loja)
       }catch(err){
           res.status(500).json({err})
       }
       }) 

    //Buscar todos  estabelecimentos - site

router.get("/site/pro" , async (req, res)=>{
    const query = req.body.new
     try{
          const  loja = query ? await Loja.find({ativo:true}).sort({_id:-1}).limit(5)  : await Loja.find({ativo:true})
     res.status(200).json(loja)
     }catch(err){
         res.status(500).json({err})
     }
     })


         //Buscar todas  prestadoras de servicos - site

router.get("/site/pro/servicos" , async (req, res)=>{
    const query = req.body.new
     try{
          const  loja = query ? await Loja.find({ativo:true, actuacao:"Prestacao_de_servicos"}).sort({_id:-1}).limit(5)  : await Loja.find({ativo:true, actuacao:"Prestacao_de_servicos"})
     res.status(200).json(loja)
     }catch(err){
         res.status(500).json({err})
     }
     })
 

         //Buscar todas fazendas  - site

router.get("/site/pro/fazenda" , async (req, res)=>{
    const query = req.body.new
     try{
          const  loja = query ? await Loja.find({ativo:true, actuacao : "Fazenda"}).sort({_id:-1}).limit(5)  : await Loja.find({ativo:true, actuacao:"Fazenda"})
     res.status(200).json(loja)
     }catch(err){
         res.status(500).json({err})
     }
     })

    //stato estabelecimento 

    router.get("/stato" , async (req, res)=>{
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