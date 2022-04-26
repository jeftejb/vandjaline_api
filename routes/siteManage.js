const router = require("express").Router()
const SiteManage = require("../models/Site")
const SiteManageImagem = require("../models/SiteIMagem")
const { verificaTokenEadmin } = require("./verificaToken")


//nova actualizacao 
router.post("/img", verificaTokenEadmin, async (req, res)=>{
    const novaAc = new SiteManage(req.body)

    try{
          const salvarAc = await novaAc.save()
          res.status(200).json(salvarAc)
    }catch(error){
        res.status(500).json({error})
    }

})

//nova actualizacao de imagem
router.post("/inf", verificaTokenEadmin, async (req, res)=>{
    const novaAcImagem = new SiteManageImagem(req.body)

    try{
          const salvarAcImagem = await novaAcImagem.save()
          res.status(200).json(salvarAcImagem)
    }catch(error){
        res.status(500).json({error})
    }

})

//buscar imagens 

router.put("/img/:id", verificaTokenEadmin, async (req , res)=>{
    try{
        const updateImagem = await SiteManageImagem.findByIdAndUpdate(req.params.id, {
            $set:req.body
        } , {new:true})
        res.status(200).json(updateImagem)
    }catch(err){res.status(500).json(err)}
    })

// buscar informacao
router.put("/inf/:id", verificaTokenEadmin, async (req , res)=>{
    try{
        const updateInf = await SiteManage.findByIdAndUpdate(req.params.id, {
            $set:req.body
        } , {new:true})
        res.status(200).json(updateInf)
    }catch(err){res.status(500).json(err)}
    })

//buscar imagens 

router.get("/img", async (req, res)=>{
    try{
        const buscarImagem  = await SiteManageImagem.find()
        res.status(200).json(buscarImagem)
    }catch(error){
        res.status(500).json({error})
    }
})

router.get("/img/:id", async (req, res)=>{
    try{
        const buscarImagem  = await SiteManageImagem.findById(req.params.id)
        res.status(200).json(buscarImagem)
    }catch(error){
        res.status(500).json({error})
    }
})


// buscar informacao
router.get("/inf", async (req, res)=>{
    
    try{
        const buscarInf  = await SiteManage.find()
        res.status(200).json(buscarImagem)
    }catch(error){
        res.status(500).json({error})
    }
})



//apagar imagens 

router.delete("/img" , async(req, res)=>{
    try{
         await SiteManageImagem.findByIdAndDelete(req.params.id)
        res.status(200).json("Imagem deletada com sucesso")
    }catch(error){
         res.status(500).json({error})
    }
})

//apagar informacoes

router.delete("/inf" , async(req, res)=>{
    try{
         await SiteManage.findByIdAndDelete(req.params.id)
        res.status(200).json("Informacao  deletada com sucesso")
    }catch(error){
         res.status(500).json({error})
    }
})


module.exports = router