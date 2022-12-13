const router = require("express").Router();
const Produto = require("../models/Produtos");
const {verificaToken, verificaTokenEadmin } = require("./verificaToken")
const {sleep}  = require("./temporizador");

const tempo = 2000;
//criar

router.post("/cadastro",  async (req, res) =>{
    console.log(req.body)
const novoProduto = new Produto(req.body)
console.log(novoProduto)
await sleep(tempo);
try{

    const salvarProduto = await novoProduto.save()
    res.status(200).json(salvarProduto)

}catch(err){
    res.status(500).json({err})
}
})

//actualizar

router.put("/:id", verificaTokenEadmin, async (req , res)=>{
    await sleep(tempo);
try{
    const updateProduto = await Produto.findByIdAndUpdate(req.params.id, {
        $set:req.body
    } , {new:true})
    res.status(200).json(updateProduto)
}catch(err){res.status(500).json({err})}
})

router.put("/menos/:id", async (req , res)=>{
   
try{
    const updateProduto = await Produto.findByIdAndUpdate(req.params.id, {
        $set:req.body
    } , {new:true})
    res.status(200).json(updateProduto)
}catch(err){res.status(500).json({err})}
})


//desativar produtos da loja 

router.put("/desativar/produtos/loja/:id", verificaTokenEadmin, async (req , res)=>{
   
    try{
        const updateProduto = await Produto.updateMany({id_loja :req.params.id}, {
            $set:req.body
        } , {new:true})
        res.status(200).json(updateProduto)
    }catch(err){res.status(500).json({err})}
    })


//actualizar recomendacoes

router.put("/recomendacoes/:id", verificaToken, async (req , res)=>{
 
    try{
        const updateProduto = await Produto.findByIdAndUpdate(req.params.id, {
            $set:req.body
        } , {new:true})
        res.status(200).json(updateProduto)
    }catch(err){res.status(500).json({err})}
    })
    
// adicionar id usuario recomdacao
    router.put("/adicionar/id/:id", verificaToken , async (req, res) =>{
   
        try{
            const updateProduto = await Produto.findByIdAndUpdate(req.params.id, {
                $set:req.body
            } , {new:true})
            res.status(200).json(updateProduto)
        }catch(err){res.status(500).json({err})}
        })


//Delete produto

router.delete("/:id", verificaTokenEadmin, async (req, res)=>{
try{
await Produto.findByIdAndDelete(req.params.id)
res.status(200).json("produto deletado com sucesso!")
}catch(err){
    res.status(500).json({err})
}
})


//Buscar produto

router.get("/:id", async (req, res)=>{
    try{
    const produto  = await Produto.findById(req.params.id)
    res.status(200).json(produto)
    }catch(err){
        res.status(500).json({err})
    }
    })

    router.get("/loja/:id", async (req, res)=>{
        try{
        const produto  = await Produto.find({id_loja : req.params.id, activo:true})
        res.status(200).json(produto)
        }catch(err){
            res.status(500).json({err})
        }
        })


        //prestacao de servicos 

        

        router.get("/servicos/todos", async (req, res)=>{
            try{
                const produto  = await Produto.find({actuacaoLoja : "Prestacao_de_servicos", activo:true})
            res.status(200).json(produto)
            }catch(err){
                res.status(500).json({err})
            }
            })


        //todos produtos do campo 
        router.get("/fazenda/todos", async (req, res)=>{
            try{
                const produto  = await Produto.find({actuacaoLoja : "Fazenda", activo:true})
            res.status(200).json(produto)
            }catch(err){
                res.status(500).json({err})
            }
            })


        // Produtos do campo loja


        router.get("/fazenda/campo/:id", async (req, res)=>{
            try{
            const produto  = await Produto.find({id_loja: req.params.id , actuacaoLoja : "Fazenda", activo:true})
            res.status(200).json(produto)
            }catch(err){
                res.status(500).json({err})
            }
            })




        router.get("/loja/admin/:id", async (req, res)=>{
            try{
            const produto  = await Produto.find({id_loja : req.params.id})
            res.status(200).json(produto)
            }catch(err){
                res.status(500).json({err})
            }
            })



    //Buscar todos  produtos

    router.get("/admin/pro", async (req, res)=>{
        const qNovo = req.query.new
        const qCategoria = req.query.categoria
        try{
            let produtos 
    
            if(qNovo){
                produtos = await Produto.find().sort({createdAt:-1}).limit(1)
    
            }else if(qCategoria){
    
                produtos = await Produto.find({categoria:{$in:[qCategoria],}})
            }else{
                produtos = await Produto.find()
            }
    
        res.status(200).json(produtos)
        }catch(err){
            res.status(500).json({err})
        }
        })
    

router.get("/", async (req, res)=>{
    const qNovo = req.query.new
    const qCategoria = req.query.categoria
    
    try{
        let produtos 

        if(qNovo){
            produtos = await Produto.find({activo:true}).sort({createdAt:-1}).limit(1)

        }else if(qCategoria){

            produtos = await Produto.find({activo:true , categoria:{$in:[qCategoria]}})
        }else{
            produtos = await Produto.find({activo:true})
        }

    res.status(200).json(produtos)
    }catch(err){
        res.status(500).json({err})
    }
    })

    //stato usuarios 

    router.get("/stato", async (req, res)=>{
const date = new Date();
const ultimoAno= new Date(date.setFullYear(date.getFullYear() -1 ))

try{
const data = await Produto.aggregate([
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