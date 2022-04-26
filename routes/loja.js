const router = require("express").Router();
const Loja = require("../models/Loja");
const {verificaToken, verificaTokenEautenticacao, verificaTokenEadmin } = require("./verificaToken")

//atualizar Estabelecimento

router.put("/:id",verificaTokenEadmin, async (req , res)=>{

if(req.body.password){
    req.body.password = Cryptojs.AES.encrypt(
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