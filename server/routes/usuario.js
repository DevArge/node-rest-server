const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

app.get('/usuario', verificaToken, (req, res)=> {
    //PRIMERO SE EJECUTA EL MIDDLEWARE Verificatoken
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({estado: true}, 'nombre email estado google role img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios)=>{
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Usuario.count({estado: true}, (err, conteo)=>{
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })
                })
            })

});
  
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res)=> {
    //el body aparece cuando el bodyparser procese las peticiones
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email : body.email,
        password : bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    //   usuarioDB.password = null;
        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });
//   if(body.nombre === undefined){
//       res.status(400).json({
//           ok: false,
//           mensaje: "el nombre es necesario"
//       });
//   }
});
  
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res)=> {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'img', 'estado']);
//   delete body.password;
//   delete body.google;

    Usuario.findByIdAndUpdate(id, body,{new:true, runValidators:true}, (err,usuarioDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

});
  
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res)=> {
    let id = req.params.id
    let cambiaEstado = {estado:false};
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true}, (err, usuarioBorrado)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err:{
                    mensaje: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })
    // ESTE CODIGO BORRA EL USUARIO PERMANENTEMENTE DE LA BD
    // Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err:{
    //                 mensaje: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok:true,
    //         usuario: usuarioBorrado
    //     });
    // })

});

module.exports = app;