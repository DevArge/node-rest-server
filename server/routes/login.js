const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');

app.post('/login', (req, res)=>{
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
        }
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN })
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    });
});

// CONFIGURACIONES DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
  }
  //verify().catch(console.error);

app.post('/google', async (req, res)=>{
    let token = req.body.idtoken;
    let googleUser = await verify(token) // si el token es valido obtengo el usuario de google
            .catch((err)=>{
                return res.status(403).json({
                    ok:false,
                    err
                })
                
            })
    // para verificar que el usuario existe o no en la DB
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(usuarioDB){// si existe ese usuario se valida si fue por google o de manera normal
            if (usuarioDB.google === false) { // si el correo existe en una cuenta normal no lo deja iniciar sesion con google
                return res.status(400).json({
                    ok: false,
                    err:{
                        message:'Debe usar su autenticacion normal'
                    }
                });
            }else{// si existe pero con google = true lo deja iniciar sesion
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN })
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token   
                })
            }
        }else{// Si el usuario no existe en nuestra DB se crea uno para que nuestro usuario se logee x google
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, usuarioDB)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN })
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    })
});


module.exports = app;