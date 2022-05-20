const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const autRoute = require("./routes/autenticacao");
const produtoRoute = require("./routes/produto");
const carrinhoRoute = require("./routes/produto");
const faturaRoute = require("./routes/fatura");
const lojaRoute = require("./routes/loja");
const categoriaRoute = require("./routes/categorias");
const publicitarRoute = require("./routes/pro_inter");
const pagamentosRoute = require("./routes/pagamentos");
const siteManage = require("./routes/siteManage")

const cors = require("cors"); 

dotenv.config();



  const allowlist = ['https://vandjaline.herokuapp.com', 'https://vandjaline-admin.herokuapp.com']
const corsOptionsDelegate =  (req, callback)=> {
 var corsOpts;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
 corsOpts = {
    origin: true,
  
    methods: [
      'GET', 'PUT', 'OPTIONS', 'POST', 'DELETE', 'UPDATE',
    ],
  
     allowedHeaders: ['Content-Type', 'x-requested-with', 'Authorization', 'Accept', 'token'],
  };
  } else {
    corsOpts = { origin: false } // disable CORS for this request
  }
  callback(null,  corsOpts) // callback expects two parameters: error and options
}

  
app.use(express.json());
app.use(cors(corsOptionsDelegate));

/*
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS, POST, DELETE, UPDATE');
    res.header('Access-Control-Allow-Headers', '*, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    app.use(cors());
    next()
});
*/

mongoose.connect(process.env.MONGO_URL/*'mongodb://127.0.0.1:27017/vandjaline_db'*/, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Conexao Criada com sucesso");
}).catch((error)=>{
    console.log("Error: erro ao criar a conexao com o banco de dados :"+error);
});


app.use("/api/autenticacao", autRoute);
app.use("/api/users", userRoute);
app.use("/api/produtos", produtoRoute);
app.use("/api/carrinho", carrinhoRoute);
app.use("/api/fatura", faturaRoute);
app.use("/api/estabelecimento", lojaRoute);
app.use("/api/categorias", categoriaRoute);
app.use("/api/publicitar", publicitarRoute);
app.use("/api/pagamentos", pagamentosRoute);
app.use("/api/site", siteManage);

app.listen(process.env.PORT|| 8080, ()=>{
    console.log("Servidor iniciado com sucesso ")
})