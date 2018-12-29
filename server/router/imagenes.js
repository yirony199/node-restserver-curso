const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg }  = require('../middlewares/autenticacion');

const app = express();

app.get('/image/:tipo/:img',verificaTokenImg, (req,res)=>{


    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathimg =  path.resolve(__dirname,`../../uploads/${ tipo }/${ img }`);
    let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');
    if( fs.existsSync(pathimg) ){
        res.sendFile( pathimg);
    }else{
        res.sendFile( noImagePath);
    }

 

});

module.exports = app;




