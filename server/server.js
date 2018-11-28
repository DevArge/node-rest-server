require('./config/config')

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
// las app.use son MIDDLEWARE todas las peticiones pasan x ahi
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, { useCreateIndex: true, useNewUrlParser: true }, (err, res)=>{
    if (err) throw err;
    console.log('Base de datos online');
});
app.listen(process.env.PORT, ()=> console.log(`Escuchando el puerto ${process.env.PORT}`))

