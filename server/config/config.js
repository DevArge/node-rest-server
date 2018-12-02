
//====================
// Puerto
//====================
process.env.PORT = process.env.PORT || 3001;

//=====================
// Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
// Vencimiento del TOKEN JWT
//=====================
// 60 segundo
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN ='48h';

//=====================
// SEED de autenticacion
//=====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

//=====================
// DataBase
//=====================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
}else{
    urlBD = process.env.MONGO_URL;
}
process.env.URLDB = urlBD;

//====================
// Google Client ID
//====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '331312473721-e47fi40gturm50frrbfqtqlkart4cbu8.apps.googleusercontent.com';
