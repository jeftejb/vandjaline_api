const router = require("express").Router();
const Fatura = require("../models/Fatura");
const {verificaToken, verificaTokenEautenticacao, verificaTokenEadmin } = require("./verificaToken")

//criar

router.post("/", verificaToken, async (req, res) =>{
const novoFatura = new Fatura(req.body)
try{

    const salvarFatura = await novoFatura.save()
    res.status(200).json(salvarFatura)

}catch(err){
    res.status(500).json({err})
}
})

//actualizar

router.put("/:id", verificaToken, async (req , res)=>{

try{
    const updateFatura = await Fatura.findByIdAndUpdate(req.params.id, {
        $set:req.body
    } , {new:true})
    res.status(200).json(updateFatura)
}catch(err){res.status(500).json(err)}
})

//actualizar fatura 

router.put("/produ/:id", async (req , res)=>{

    try{
        const updateFatura = await Fatura.findOneAndUpdate({_id:req.params.id, "produtos._id":req.body.id} ,{
             $set:{"produtos.$.estatus":"Aprovado"}
         }, {rew:true})
         res.status(200).json(updateFatura)
    }catch(err){res.status(500).json({err})}
    })

//Delete usuario

router.delete("/:id", verificaToken, async (req, res)=>{
try{
await Fatura.findByIdAndDelete(req.params.id)
res.status(200).json("Fatura deletado com sucesso!")
}catch(err){
    res.status(500).json({err})
}
})


//Buscar produtos Fatura Usuario

router.get("/:id", verificaTokenEautenticacao, async (req, res)=>{
     try{
     const fatura  = await Fatura.find({_id:req.params.id})
     res.status(200).json(fatura)
    
     }catch(err){
         res.status(500).json({err})
     }
     })

     //buscar produtos da fatura pagamento 

     
router.get("/pagamento/:id", async (req , res)=>{

    try{
        const faturaPag = await Fatura.findById(req.params.id);
         res.status(200).json(faturaPag)
    }catch(err){res.status(500).json({err})}
    })

router.get("/loja/:id", verificaTokenEautenticacao, async (req, res)=>{
   // const id_loja ={id_produto:req.params.id}
    try{
        //console.log(req.params)
    const fatura  = await Fatura.find({"produtos.id_loja":req.params.id})
    res.status(200).json(fatura)
   
    }catch(err){
        res.status(500).json({err})
    }
    })

    router.get("/user/:id",  async (req, res)=>{
        try{
        const fatura  = await Fatura.find({id_usuario: req.params.id} )
        res.status(200).json(fatura)
        }catch(err){
            res.status(500).json({err})
        }
        })

    //Buscar  fatura

router.get("/", verificaTokenEadmin,  async (req, res)=>{
    try{
        const fatura = await Fatura.find()

    res.status(200).json(fatura)
    }catch(err){
        res.status(500).json({err})
    }
    })

    //Pegar o montante

    router.get("/income/resul", verificaToken , async (req, res)=>{
        const date = new Date()
        const ultimoMes = new Date(date.setMonth(date.getMonth()-1))
        const previlMes = new Date(new Date().setMonth(ultimoMes.getMonth()-1))
        try{
            const income = await Fatura.aggregate([
                {$match : {createdAt:{$gte: previlMes}}}, 
                {
                    $project:{month:{$month:"$createdAt"} , sales:"$motante"}, 
                   
                }, 
                {
                    $group:{
                        _id:"$month", 
                        total:{$sum: "$sales"}
                    }
                }
            ])
                    
            res.status(200).json(income)
        }catch(err){
            res.status(500),json({err})
        }


    })

  

module.exports = router;