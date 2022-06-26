const router = require("express").Router();
const Pagamentos = require("../models/Pagamentos");
const {verificaToken, verificaTokenEautenticacao, verificaTokenEadmin } = require("./verificaToken")

//criar

router.post("/" , async (req, res) =>{
  
const novoPagamento = new Pagamentos(req.body)
try{

    const salvarPagamento = await novoPagamento.save()
    res.status(200).json(salvarPagamento )

}catch(err){
    res.status(500).json({err})
}
})

//actualizar

router.put("/:id", verificaTokenEautenticacao, async (req , res)=>{
const stato = {estatos:"Aceite"}
try{
    const updatePagamentos = await Pagamentos.findByIdAndUpdate(req.params.id, {
        $set:stato
    } , {new:true})
    res.status(200).json(updatePagamentos)
}catch(err){res.status(500).json({err})}
})

//negar

router.put("/negar/:id", verificaTokenEautenticacao, async (req , res)=>{
    const stato = {estatos:"Negado"}
    try{
        const updatePagamentos = await Pagamentos.findByIdAndUpdate(req.params.id, {
            $set:stato
        } , {new:true})
        res.status(200).json(updatePagamentos)
    }catch(err){res.status(500).json({err})}
    })

//Delete usuario

router.delete("/:id", verificaTokenEautenticacao, async (req, res)=>{
try{
await Pagamentos.findByIdAndDelete(req.params.id)
res.status(200).json("produto deletado com sucesso!")
}catch(err){
    res.status(500).json({err})
}
})



    //Buscar  Carrinho Usuario

router.get("/", verificaTokenEautenticacao,  async (req, res)=>{
   
    try{
        const pagamentos = await Pagamentos.find({estatos:"Pendente"})

    res.status(200).json(pagamentos)
    }catch(err){
        res.status(500).json({err})
    }
    })


    //todos pagamentos 

    router.get("/todos/", verificaTokenEautenticacao,  async (req, res)=>{
   
        try{
            const pagamentos = await Pagamentos.find()
    
        res.status(200).json(pagamentos)
        }catch(err){
            res.status(500).json({err})
        }
        })


    //bsca de pagamentos com id 


    router.get("/:id", verificaToken,  async (req, res)=>{
   
        try{
            const pagamentos = await Pagamentos.find({id_usuario : req.params.id});
        res.status(200).json(pagamentos)
        }catch(err){
            res.status(500).json({err})
        }
        })
    

  

module.exports = router;