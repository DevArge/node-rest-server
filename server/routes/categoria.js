const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');
let { index } = require('../controllers/categoriaController')
//================================
// Mostrar todas las categorias
//================================
app.get('/categoria', verificaToken,index); // la funcion esta en el controlador

//================================
// Mostrar una categoria por ID
//================================
app.get('/categoria/:id', verificaToken, (req, res)=>{
    let idCategoria = req.params.id;
    Categoria.findById(idCategoria, (err, categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err:{
                    message:'Categoria no existe'
                }
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    mensaje: 'Categoria no encontrada'
                }
            })
        }else{
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        } 
    });
});

//================================
// Crear nueva categoria
//================================
app.post('/categoria', verificaToken, (req, res)=>{
    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });
});

//================================
// Mostrar todas las categorias
//================================
app.put('/categoria/:id', (req, res)=>{
    let idCategoria = req.params.id;
    Categoria.findByIdAndUpdate(idCategoria, {descripcion: req.body.descripcion}, {new:true, runValidators: true}, (err, categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    mensaje: 'Categoria no encontrada'
                }
            })
        }else{
            res.json({
                ok:true,
                categoria: categoriaDB
            });
        }
    });
});

//================================
// Mostrar todas las categorias
//================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res)=>{
    // solo un admin puede borrar
    let idCategoria = req.params.id;
    Categoria.findByIdAndRemove(idCategoria, (err, categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    mensaje: 'Categoria no encontrada'
                }
            })
        }else{
            res.json({
                ok:true,
                categoria: categoriaDB,
                message: 'categoria borrada'
            });
        }
    });

});

module.exports = app;

