require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
// las app.use son MIDDLEWARE todas las peticiones pasan x ahi
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
  res.json('get usuario')
});

app.post('/usuario', function (req, res) {
    //el body aparece cuando el bodyparser procese las peticiones
    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: "el nombre es necesario"
        });
    }else{
        res.json({
            body
        })
    }
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
});
 
app.listen(process.env.PORT, ()=> console.log(`Escuchando el puerto ${process.env.PORT}`))