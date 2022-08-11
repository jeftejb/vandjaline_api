const router = require("express").Router();
const User = require("./../models/User");
const Loja = require("../models/Loja");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken") ;
const { verificaToken } = require("./verificaToken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const {google} = require("googleapis")
const {sleep}  = require("./temporizador");
const SiteManage = require("../models/Site");
const { env } = require("process");

const tempo = 3000;

//var pdfMake = require('pdfmake/build/pdfmake.js');
//var pdfFonts = require('pdfmake/build/vfs_fonts.js');

 
//Registro usuario
dotenv.config();



//const buscar = await SiteManage.find() 




//const TOKENEMAIL = token_email

router.post("/registro/usuario", async (req, res)=>{

const newUser = new User({
    nomeCompleto:req.body.nomeCompleto, 
    dataNascimento:req.body.dataNascimento,
    sexo:req.body.sexo, 
    numeroTelefone:req.body.numeroTelefone,
    pais:req.body.pais,
    provincia:req.body.provincia, 
    municipio:req.body.municipio, 
    endereco:req.body.endereco, 
    email:req.body.email,   
    imagem:req.body.imagem,  
    nomeUsuario:req.body.nomeUsuario, 
    convidado:req.body.id,
    password:CryptoJS.AES.encrypt(
        req.body.password, process.env.PASS_SEC
        ).toString()
})

await sleep(tempo);

try{
const salvarUsuario = await newUser.save()
res.status(200).json(salvarUsuario)
}catch(error){res.status(500).json({error})}
})


//Registro estabelecimento

router.post("/registro/estabelecimento", async (req, res)=>{
    
  

    const newEstabelecimento = new Loja({
        nomeLoja:req.body.nomeLoja, 
        gerenteLoja:req.body.gerenteLoja, 
        nifLoja:req.body.nifLoja, 
        emailLoja:req.body.emailLoja, 
        telefoneLoja:req.body.telefoneLoja, 
        enderecoLoja:req.body.enderecoLoja, 
        provinciaLoja:req.body.provincia,
        municipioLoja:req.body.municipio, 
        actuacao:req.body.actuacao, 
        imagem:req.body.imagem, 
        descricao:req.body.descricao,  
        password:CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SEC
            ).toString()
    })
  
    await sleep(tempo);

    try{
    const salvarEstabelecimento  = await newEstabelecimento.save()
    res.status(200).json(salvarEstabelecimento)
    }catch(error){
        res.status(500).json({error})
    }
    })
     


//login usuario

router.post("/login/usuario", async (req, res)=>{

    await sleep(tempo);

try{
    const user = await User.findOne({nomeUsuario : req.body.nomeUsuario});
    !user &&  res.status(401).send(json({Nome:"Nome Errado"}))

const haspass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
const Originalpassword = haspass.toString(CryptoJS.enc.Utf8);
    Originalpassword !== req.body.password && res.status(401).send(json({Password:"password Errado"}))

    const acessoToken = jwt.sign(
        {
        id: user._id, 
        isAdmin:user.isAdmin,
     }, 

    process.env.JWT_SEC, 
    {expiresIn : "3d"}

    )
   
const {password, ...others} = user._doc
    res.status(200).json({...others, acessoToken})
}catch(err){
    res.status(500).json({err})
}
    
})

router.post("/confirm",verificaToken, async (req, res)=>{
 
    await sleep(tempo);

    try{
        const user = await User.findById(req.body.id);
        !user && console.log("usuario nao encontrado")
        
        if(user?.codigoConfirm === Number(req.body.confirm_codigo)){ 
           
            await User.updateOne({_id:{$eq:req.body.id}}, {$set:{confirmado: true, intermediario:"Confirmado"}})
            res.status(200).json(user._doc)
        } else{
            
        alert("Número incompatível, por favor solicite outro número obrigado")
        }
        
    }catch(err){
        return res.status(500).json({err})
    }
        
    })
    
    




//login Estabelecimento
router.post("/login/estabelecimento", async (req, res)=>{

    await sleep(tempo);
  
    try{
        const loja = await Loja.findOne({emailLoja : req.body.nomeUsuario});
        !loja && res.status(401).send(json({Email:"Email Errado"}))
        
    const haspass = CryptoJS.AES.decrypt(loja.password, process.env.PASS_SEC);
    const Originalpassword = haspass.toString(CryptoJS.enc.Utf8);
        Originalpassword !== req.body.password && res.status(401).send(json({Password:"password Errado"}))
        
        const acessoToken = jwt.sign(
            {
                id: loja._id, 
               isAdmin: loja.isAdmin,
            }, 
            process.env.JWT_SEC,
            {
              expiresIn:"3d"
            }
        )
        const {password, ...others} = loja._doc
        res.status(200).json({...others, acessoToken })
       
    }catch(err){
       return  res.status(500).json({err})
    }

})



router.post("/email", async (req, res )=>{

    const tokenEmail =  await SiteManage.find() 
    const GOODLE_CLIENTE_TOKEN = tokenEmail[0]?.token_email

    const authe2 = google.auth.OAuth2

    const autCliente = new authe2(
        process.env.GOODLE_CLIENTE_ID,
        process.env.GOODLE_CLIENTE_CHAVE,
        process.env.GOODLE_CLIENTE_URI
    )
    
    autCliente.setCredentials(
        {  refresh_token: GOODLE_CLIENTE_TOKEN }
    )
    
    const acessoToken = new Promise((resolve, reject)=>{
        autCliente.getAccessToken((error, token)=>{
            if(error) reject(error)
            resolve(token)
        })
    })
    
   
   
    try{
    
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOODLE_CLIENTE_ID, acessoToken,
                clientSecret: process.env.GOODLE_CLIENTE_CHAVE,
                refreshToken: GOODLE_CLIENTE_TOKEN,
                
            },
          });
          // send mail with defined transport object
             await transporter.sendMail({
            from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
            to: req.body.email, // list of receivers
            subject: "Saudações vandja✔", // Subject line
            text: "Codigo de confirmação", // plain text body
            html: `
            
            <b>O seu codigo de confirmação é : ${req.body.conteudo}</b>
            
            `, // html body
          });
        
    


}catch(erro){
    console.log(erro)

}

})
// email de confirmacao
router.post("/email/confirmacao", async (req, res )=>{
    
   const tokenEmail =  await SiteManage.find() 
   const GOODLE_CLIENTE_TOKEN = tokenEmail[0]?.token_email


    const authe2 = google.auth.OAuth2

    const autCliente = new authe2(
        process.env.GOODLE_CLIENTE_ID,
        process.env.GOODLE_CLIENTE_CHAVE,
        process.env.GOODLE_CLIENTE_URI
    )
    
    autCliente.setCredentials(
           {refresh_token: GOODLE_CLIENTE_TOKEN  } 
    )
    
    const acessoToken = new Promise((resolve, reject)=>{
        autCliente.getAccessToken((error, token)=>{
            if(error) reject(error)
            resolve(token)
        })
    })
    
    
   
    try{
    
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOODLE_CLIENTE_ID, acessoToken,
                clientSecret: process.env.GOODLE_CLIENTE_CHAVE,
                refreshToken: GOODLE_CLIENTE_TOKEN,
                
            },
          });
          // send mail with defined transport object
             await transporter.sendMail({
            from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
            to: req.body.email, // list of receivers
            subject: "Saudações vandja✔", // Subject line
            text: "Seja bem vindo/a", // plain text body
            html: `
            
            <b>Muito obrigado por se inscrever no nosso site, esperamos que tenha uma boa esperiencia navegando no nosso site, mas para concluir o cadastro por favor clique em confirmar cadastro</b><p/><br/>
            <a href ="${process.env.SITE_URL}/confirmar/${req.body.id}" >Confirmar cadastro </a>
            `, // html body
          });
        
    
    
    }catch(erro){
        console.log(erro)
    
    }
    
})
//email de recuperacao de senha
router.post("/email/recuperacao", async (req, res )=>{
    const tokenEmail =  await SiteManage.find() 
    const GOODLE_CLIENTE_TOKEN = tokenEmail[0]?.token_email
   
    const authe2 = google.auth.OAuth2

    const autCliente = new authe2(
        process.env.GOODLE_CLIENTE_ID,
        process.env.GOODLE_CLIENTE_CHAVE,
        process.env.GOODLE_CLIENTE_URI
    )
    
    
    autCliente.setCredentials({
        refresh_token : GOODLE_CLIENTE_TOKEN 
    })
    
    const acessoToken = new Promise((resolve, reject)=>{
        autCliente.getAccessToken((error, token)=>{
            if(error) reject(error)
            resolve(token)
        })
    })
    
    
   
    try{
    
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOODLE_CLIENTE_ID, acessoToken,
                clientSecret: process.env.GOODLE_CLIENTE_CHAVE,
                refreshToken: GOODLE_CLIENTE_TOKEN,
                
            },
          });
            
              // send mail with defined transport object
                 await transporter.sendMail({
                from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
                to: req.body.email, // list of receivers
                subject: "Saudações vandja Recuperação de senha ✔", // Subject line
                text: "Seja bem vindo/a", // plain text body
                html: `
                
                <p>Email de recuperação de senha, clica no link  "recuperar" para finalizar o processo obrigado. </p><br/>
                <a href ="${process.env.SITE_URL}/recuperar/senha/mudar/${req.body.email}" >Recuperar</a>
                `, // html body
              });
            
        
        
        }catch(erro){
            console.log(erro)
        
        }
        
})
        //email pagamento
router.post("/email/pagamento", async (req, res )=>{
    const tokenEmail =  await SiteManage.find() 
    const GOODLE_CLIENTE_TOKEN = tokenEmail[0]?.token_email

    const authe2 = google.auth.OAuth2

    const autCliente = new authe2(
        process.env.GOODLE_CLIENTE_ID,
        process.env.GOODLE_CLIENTE_CHAVE,
        process.env.GOODLE_CLIENTE_URI
    )
    
    
    autCliente.setCredentials({
        refresh_token : GOODLE_CLIENTE_TOKEN 
    })
    
    const acessoToken = new Promise((resolve, reject)=>{
        autCliente.getAccessToken((error, token)=>{
            if(error) reject(error)
            resolve(token)
        })
    })
    
    
   
    try{
    
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOODLE_CLIENTE_ID, acessoToken,
                clientSecret: process.env.GOODLE_CLIENTE_CHAVE,
                refreshToken: GOODLE_CLIENTE_TOKEN,
                
            },
          });
                
                  // send mail with defined transport object
                     await transporter.sendMail({
                    from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
                    to: req.body.email, // list of receivers
                    subject: "Saudações vandja✔", // Subject line
                    text: "Seja bem vindo", // plain text body
                    html: `

                    <b>Solicitação de pagamento da loja ${req.body.nome} </b><br/><br/>
                    <b>Muito obrigado por usares  no nosso site, esperamos que continues a usar o nosso tite </b><br/><br/>

                    <table style=>
                    <thead>
                    <tr className="widgetLgTr">
                      <th className="widgetLgTh">Produto</th>
                      <th className="widgetLgTh">Quantidade</th>
                      <th className="widgetLgTh">Valor</th>
                     
                    </tr>
                    </thead>
                    <tbody>
                    ${req.body.produtos.map((fatura, i)=>(
                    `
                    <tr className="widgetLgTr" key=${i}>
                    
                      <td className="widgetLgUser">
                        <span className="widgetLgName">${fatura?.titulo }</span>
                      </td>
                      <td className="widgetLgDate">${fatura?.quantidade}</td>
                      <td className="widgetLgAmount">${fatura?.preco}</td>
                    </tr>
                `
                    ))}
                    </tbody>
                  </table><br/><br/>
                  Valor a se pagar  :${Number(req.body.total).toFixed(2)} <br/> <br/>
                  <a href="${req.body.url}" >Efectuar Pagamento</a><br/><br/>

                   Contactos da loja : <br/>
                   Telefone: ${req.body.telefone}<br/>
                   email: ${req.body.emailLoja}<br/><br/>

                   
                    `, // html body
                  });
                
            
            
            }catch(erro){
                console.log(erro)
            
            }
            
})  
// email de canselamento de pedido
router.post("/email/cancela", async (req, res )=>{
    const tokenEmail =  await SiteManage.find() 
    const GOODLE_CLIENTE_TOKEN = tokenEmail[0]?.token_email

    const authe2 = google.auth.OAuth2

    const autCliente = new authe2(
        process.env.GOODLE_CLIENTE_ID,
        process.env.GOODLE_CLIENTE_CHAVE,
        process.env.GOODLE_CLIENTE_URI
    )
    
    
    autCliente.setCredentials({
        refresh_token : GOODLE_CLIENTE_TOKEN 
    })
    
    const acessoToken = new Promise((resolve, reject)=>{
        autCliente.getAccessToken((error, token)=>{
            if(error) reject(error)
            resolve(token)
        })
    })
    
    
   
    try{
    
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOODLE_CLIENTE_ID, acessoToken,
                clientSecret: process.env.GOODLE_CLIENTE_CHAVE,
                refreshToken: GOODLE_CLIENTE_TOKEN,
                
            },
          });
        
          // send mail with defined transport object
             await transporter.sendMail({
            from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
            to: req.body.email, // list of receivers
            subject: "Saudações vandja , Aviso de canselamento !!", // Subject line
            text: "Email de canselamento", // plain text body
            html: `
            
            <b>Email de canselamento a Loja ${req.body.loja} canselou o seu pedido </b><br/><br/>
            <a href ="${process.env.SITE_URL}/login" >Ir para o site<a/>
            `, // html body
          });
        
    
    
    }catch(erro){
        console.log(erro)
    
    }
    
})


//email de solicitacao de pagamento da loja 



router.post("/email/pagamento/loja", async (req, res )=>{

    const tokenEmail =  await SiteManage.find() 
    const GOODLE_CLIENTE_TOKEN = tokenEmail[0]?.token_email

    const authe2 = google.auth.OAuth2

    const autCliente = new authe2(
        process.env.GOODLE_CLIENTE_ID,
        process.env.GOODLE_CLIENTE_CHAVE,
        process.env.GOODLE_CLIENTE_URI
    )
    
    
    autCliente.setCredentials({
        refresh_token : GOODLE_CLIENTE_TOKEN 
    })
    
    const acessoToken = new Promise((resolve, reject)=>{
        autCliente.getAccessToken((error, token)=>{
            if(error) reject(error)
            resolve(token)
        })
    })
    
    
   
    try{
    
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOODLE_CLIENTE_ID, acessoToken,
                clientSecret: process.env.GOODLE_CLIENTE_CHAVE,
                refreshToken: GOODLE_CLIENTE_TOKEN,
                
            },
          });
        
          // send mail with defined transport object
             await transporter.sendMail({
            from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
            to: req.body.email, // list of receivers
            subject: "Saudações vandja , Solicitacao de Pagamento !!", // Subject line
            text: "Solicitacao de Pagamento", // plain text body
            html: `
            
            <b> Solicitacao de pagamento do pacote : ${req.body.pacote} , para  ${req.body.loja} , no  valor de ${req.body.valor}  </b><br/><br/>
            <b> Para finalizar o pagamento porfavor clique neste link: https://www.usekamba.com/u/vandjaline_vandjaline  </b><br/><br/>

            <b> Se ainda nao possui a carteira Kamba clique no link para baixar : https://m.usekamba.com/convite/86C210   </b><br/><br/>
            <a href ="${process.env.SITE_URL}/login" >Ir para o site<a/>
            `, // html body
          });
        
    
    
    }catch(erro){
        console.log(erro)
    
    }
    
})


//email para o estabelecimento inscrito 


router.post("/email/link/loja", async (req, res )=>{

    const tokenEmail =  await SiteManage.find() 
    const GOODLE_CLIENTE_TOKEN = tokenEmail[0]?.token_email

    const authe2 = google.auth.OAuth2

    const autCliente = new authe2(
        process.env.GOODLE_CLIENTE_ID,
        process.env.GOODLE_CLIENTE_CHAVE,
        process.env.GOODLE_CLIENTE_URI
    )
    
    
    autCliente.setCredentials({
        refresh_token : GOODLE_CLIENTE_TOKEN 
    })
    
    const acessoToken = new Promise((resolve, reject)=>{
        autCliente.getAccessToken((error, token)=>{
            if(error) reject(error)
            resolve(token)
        })
    })
    
    
   
    try{
    
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_FROM,
                clientId: process.env.GOODLE_CLIENTE_ID, acessoToken,
                clientSecret: process.env.GOODLE_CLIENTE_CHAVE,
                refreshToken: GOODLE_CLIENTE_TOKEN,
                
            },
          });
        
          // send mail with defined transport object
             await transporter.sendMail({
            from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
            to: req.body.email, // list of receivers
            subject: "Saudações vandja !!", // Subject line
            text: "Link para Administrador", // plain text body
            html: `
            
            <b> A Vandjaline agradece pelo seu cadastro  esperamos que tenha uma boa experiencia utilizando nosso site, em caso de duvida ou sujestão por favor entre em contacto.</b><br/><br/>
            
            <b> O seu link para área de administração: ${process.env.SITE_URL_ADMIN}</b><br/><br/>

            <b> Se ainda nao possui a carteira Kamba clique no link para baixar : https://m.usekamba.com/convite/86C210   </b><br/><br/>
            <a href ="${process.env.SITE_URL}/login" >Ir para o site<a/>
            `, // html body
          });
        
    
    
    }catch(erro){
        console.log(erro)
    
    }
    
})





module.exports = router;