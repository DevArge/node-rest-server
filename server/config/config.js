
//====================
// Puerto
//====================
process.env.PORT = process.env.PORT || 3001;

//=====================
// Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
// DataBase
//=====================

let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
}else{
    urlBD = 'mongodb://cafe-user:abc123@ds155674.mlab.com:55674/cafe';
}

process.env.URLDB = urlBD;
