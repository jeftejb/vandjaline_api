const router = require("express").Router()
const Categorias = require("../models/Categorias")


//nova categoria 
router.post("/", async (req, res)=>{
    const novoCat = new Categorias(req.body)

    try{
          const salvarCat = await novoCat.save()
          res.status(200).json(salvarCat)
    }catch(error){
        res.status(500).json({error})
    }

})

//actualizar categoroa 

router.put("/:id", async (req, res)=>{
    try{
   const actualizarCat = await Categorias.findByIdAndUpdate(req.param.id,{$set:req.body}, {new:true})
   res.status(200).json(actualizarCat)
    }catch(error){
      res.status(500).json({error})
    }
})


//buscar categorias  

router.get("/", async (req, res)=>{
    try{
        const buscarCat  = await Categorias.find()
        res.status(200).json(buscarCat)
    }catch(error){
        res.status(500).json({error})
    }
})

router.get("/:id", async (req, res)=>{
    
    try{
        const buscarCat  = await Categorias.find({_id:req.params.id})
        res.status(200).json(buscarCat)
    }catch(error){
        res.status(500).json({error})
    }
})



//apagar categoria

router.delete("/:id" , async(req, res)=>{
    try{
         await Categorias.findByIdAndDelete(req.params.id)
        res.status(200).json("Categoria deletada com sucesso")
    }catch(error){
         res.status(500).json({error})
    }
})

module.exports = router