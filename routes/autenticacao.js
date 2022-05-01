const router = require("express").Router();
const User = require("./../models/User");
const Loja = require("../models/Loja");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken") ;
const { verificaToken } = require("./verificaToken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

//var pdfMake = require('pdfmake/build/pdfmake.js');
//var pdfFonts = require('pdfmake/build/vfs_fonts.js');

 
//Registro usuario

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
    password:CryptoJS.AES.encrypt(
        req.body.password, process.env.PASS_SEC
        ).toString()
})

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
  
    
    try{
    const salvarEstabelecimento  = await newEstabelecimento.save()
    res.status(200).json(salvarEstabelecimento)
    }catch(error){
        res.status(500).json({error})
    }
    })
     


//login usuario

router.post("/login/usuario", async (req, res)=>{
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
 

    try{
        const user = await User.findById(req.body.id);
        !user && console.log("usuario nao encontrado")
        
        if(user?.codigoConfirm === Number(req.body.confirm_codigo)){ 
           
            await User.updateOne({_id:{$eq:req.body.id}}, {$set:{confirmado: true}})
            res.status(200).json(user._doc)
        } else{
            
            //console.log(user.codigoInter, Number(req.body.confirm_codigo))
        }
        
    }catch(err){
        return res.status(500).json({err})
    }
        
    })
    
    




//login Estabelecimento
router.post("/login/estabelecimento", async (req, res)=>{
  
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
   
try{

    // Get Mailer To Go SMTP connection details
    let mailertogo_host     = process.env.MAILERTOGO_SMTP_HOST;
    let mailertogo_port     = process.env.MAILERTOGO_SMTP_PORT || 587;
    let mailertogo_user     = process.env.MAILERTOGO_SMTP_USER;
    let mailertogo_password = process.env.MAILERTOGO_SMTP_PASSWORD;
    let mailertogo_domain   = process.env.MAILERTOGO_DOMAIN || "uservandja@gmail.com";
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: mailertogo_host,
      port: mailertogo_port,
      requireTLS: true, // Must use STARTTLS
      //secure: false,
      auth: {
        user: mailertogo_user,
        pass: mailertogo_password,
      },
    });
  
    // Sender domain must match mailertogo_domain or otherwise email will not be sent
    let from = `"Vandjaline👻" <${mailertogo_domain}>`;
  
    // Change to recipient email. Make sure to use a real email address in your tests to avoid hard bounces and protect your reputation as a sender.
    let to = req.body.email ;
  
    let subject = "Mailer To Go Test";
  
    // Send mail with defined transport object
     await transporter.sendMail({
      from: from, // Sender address, must use the Mailer To Go domain
      to: to, // Recipients
      subject: subject, // Subject line
      text: "Test from Mailer To Go 😊.", // Plain text body
      html: "Test from <b>Mailer To Go</b> 😊.", // HTML body
    });
  
    

}catch(erro){
    console.log(erro)

}

})


// email de confirmacao

router.post("/email/confirmacao", async (req, res )=>{
   
    try{
    
        const  transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
              auth: {
                user : process.env.EMAIL_USERNAME,
                pass : process.env.EMAIL_PASSWORD
              }
          });
          // send mail with defined transport object
             await transporter.sendMail({
            from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
            to: req.body.email, // list of receivers
            subject: "Saudações vandja✔", // Subject line
            text: "Seja bem vindo", // plain text body
            html: `
            
            <b>Muito obrigado por se inscrever no nosso site, esperamos que tenha uma boa esperiencia navegando no nosso site, mas para concluir o cadastro por favor clique em confirmar cadastro</b>
            <a href ="${process.env.SITE_URL}/confirmar/${req.body.id}" >Confirmar cadastro <a/>
            `, // html body
          });
        
    
    
    }catch(erro){
        console.log(erro)
    
    }
    
    })
    


//email de recuperacao de senha

    router.post("/email/recuperacao", async (req, res )=>{
   
        try{
        
            const  transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                  auth: {
                    user : process.env.EMAIL_USERNAME,
                    pass : process.env.EMAIL_PASSWORD
                  }
              });
            
              // send mail with defined transport object
                 await transporter.sendMail({
                from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
                to: req.body.email, // list of receivers
                subject: "Saudações vandja Recuperação de senha ✔", // Subject line
                text: "Seja bem vindo", // plain text body
                html: `
                
                <b>Email de recuperação de senha, clica no link  "recuperar" para finalizar o processo obrigado. </b>
                <a href ="${process.env.SITE_URL}/recuperar/senha/mudar/${req.body.email}" >Recuperar<a/>
                `, // html body
              });
            
        
        
        }catch(erro){
            console.log(erro)
        
        }
        
        })


        //email pagamento


        router.post("/email/pagamento", async (req, res )=>{
            try{
                const  transporter = nodemailer.createTransport({
                    service: process.env.EMAIL_SERVICE,
                      auth: {
                        user : process.env.EMAIL_USERNAME,
                        pass : process.env.EMAIL_PASSWORD
                      }
                  });
                
                  // send mail with defined transport object
                     await transporter.sendMail({
                    from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
                    to: req.body.email, // list of receivers
                    subject: "Saudações vandja✔", // Subject line
                    text: "Seja bem vindo", // plain text body
                    html: `

                    <b>Solicitacao de pagamento da loja ${req.body.nome} </b><br/><br/>
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
                  <a href="${req.body.url}" >Efectuar Pagamento</a>

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
    try{
    
        const  transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
              auth: {
                user : process.env.EMAIL_USERNAME,
                pass : process.env.EMAIL_PASSWORD
              }
          });
        
          // send mail with defined transport object
             await transporter.sendMail({
            from: `"Vandjaline👻" <${process.env.EMAIL_FROM}>`, // sender address
            to: req.body.email, // list of receivers
            subject: "Saudações vandja , Aviso de canselamento !!", // Subject line
            text: "Emial de canselamento", // plain text body
            html: `
            
            <b>Email de canselamento a Loja ${req.body.loja} canselou o seu pedido </b><br/><br/>
            <a href ="${process.env.SITE_URL}/login" >Ir para o site<a/>
            `, // html body
          });
        
    
    
    }catch(erro){
        console.log(erro)
    
    }
    
    })





module.exports = router;