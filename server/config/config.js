
//==============================
//Puerto
//==============================

process.env.PORT = process.env.PORT || 3000;


//==============================
//Entorno
//==============================

process.env.NODE_ENV =  process.env.NODE_ENV  || 'dev';




//==============================
//Vencimiento del Token
//==============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

process.env.CADUCIDAD_TOKEN = '48h';

//==============================
//SEED de autenticacion
//==============================

process.env.SEED  = process.env.SEED || 'este-es-el-seed-desarrollo';

//==============================
//Base de datos
//==============================
let urlDB;
if(process.env.NODE_ENV  == 'dev'){
    urlDB = "mongodb://localhost:27017/cafe";
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.urlDBN = urlDB;

//==============================
// google client id
//==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '117920313643-f63edbn8glql61hjd7gebhlhq2brni0s.apps.googleusercontent.com';






