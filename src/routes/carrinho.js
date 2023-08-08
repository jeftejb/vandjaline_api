const router = require("express").Router();
const Carrinho = require("../models/Carrinho");
const {verificaToken, verificaTokenEautenticacao, verificaTokenEadmin } = require("./verificaToken")

//criar

router.post("/", verificaToken, async (req, res) =>{
const novoCarrinho = new Carrinho(req.body)
try{

    const salvarCarrinho = await novoCarrinho.save()
    res.status(200).json(salvarCarrinho)

}catch(err){
    res.status(500).json({err})
}
})

//actualizar

router.put("/:id", verificaTokenEautenticacao, async (req , res)=>{

try{
    const updateCarrinho = await Carrinho.findByIdAndUpdate(req.params.id, {
        $set:req.body
    } , {new:true})
    res.status(200).json(updateCarrinho)
}catch(err){res.status(500).json({err})}
})

//Delete usuario

router.delete("/:id", verificaTokenEautenticacao, async (req, res)=>{
try{
await Carrinho.findByIdAndDelete(req.params.id)
res.status(200).json("produto deletado com sucesso!")
}catch(err){
    res.status(500).json({err})
}
})


//Buscar produtos Carrinho Usuario

router.get("/pesquisa/:usuarioId", verificaTokenEautenticacao, async (req, res)=>{
    try{
    const carrinho  = await Carrinho.findOne({usuarioId: req.params.usuarioId})
    res.status(200).json(carrinho)
    }catch(err){
        res.status(500).json({err})
    }
    })

    //Buscar  Carrinho Usuario

router.get("/pesquisa/", verificaTokenEautenticacao,  async (req, res)=>{
   
    try{
        const carrinho = await Carrinho.find()

    res.status(200).json(carrinho)
    }catch(err){
        res.status(500).json({err})
    }
    })

  

module.exports = router;