require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const path = require("path");
 

var bodyParser = require('body-parser');
const app = express()



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public 
app.use(express.static(path.resolve(__dirname  , '../public')));

app.use(require("./router/index"));

mongoose.connect(process.env.urlDBN, (err, res  )=>{
  if(err) throw err;
  console.log("Base de datos ONLINE");
});

app.listen(process.env.PORT , () => {
  console.log("Escuchando puerto: ", process.env.PORT );
})