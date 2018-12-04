require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
 

var bodyParser = require('body-parser');
const app = express()



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())


app.use(require("./router/usuarios"));

mongoose.connect(process.env.urlDBN, (err, res  )=>{
  if(err) throw err;
  console.log("Base de datos ONLINE");
});

app.listen(process.env.PORT , () => {
  console.log("Escuchando puerto: ", process.env.PORT );
})