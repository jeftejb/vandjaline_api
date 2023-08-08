const mongoose = require("mongoose")

const sleep = (ms) =>{
return new mongoose.Promise((resolve)=>{
setTimeout(resolve, ms)
});
}


module.exports = {
    sleep 
}