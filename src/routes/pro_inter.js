const router = require("express").Router();
const ProInter = require("./../models/Pro_inter");
const {verificaToken, verificaTokenEautenticacao, verificaTokenEadmin } = require("./verificaToken");

const {sleep}  = require("./temporizador");


const tempo = 3000;

router.post("/insert", verificaToken, async (req, res)=>{
     const prod_d = new ProInter({
         id_intermediario: req.body.id_intermediario, 
         codigoInter: req.body.codigoInter,
         nome_inter: req.body.nome_inter, 
         id_produto:req.body.id_produto,
         imagem_pro:req.body.imagem_pro,
         titulo:req.body.titulo,
         preco:req.body.preco,
         loja:req.body.loja, 
         url_pro:req.body.url_pro
     })
     
     sleep(tempo)

    try{
      
        const salvarInfPro = await prod_d.save();
        res.status(200).json(salvarInfPro);
    }catch(error){
        res.status(500).json({error});
    }

})


router.get("/:id", async (req, res)=>{
        const query = req.query.new;
    try{
        const proPub = query ? await ProInter.find().sort({createdAt:-1}).limit(5) : await ProInter.find({id_intermediario:req.params.id})
        res.status(200).json(proPub)
    }catch(error){
        res.status(500).json({error})
    }
})

router.get("/buscaCod/inter",  async (req, res)=>{
    const cod = Number(req.query.cod);
    
try{
    const proPubCod =  await ProInter.find({codigoInter:{$in:cod,}})
    res.status(200).json(proPubCod)
}catch(error){
    res.status(500).json({error})
}
})




router.delete("/:id", verificaToken, async (req, res)=>{
    try{
    await ProInter.findByIdAndDelete(req.params.id)
    res.status(200).json("usuario deletado com sucesso!")
    }catch(err){
        res.status(500).json({err})
    }
    })


    module.exports = router;