const express = require('express')
const { verificaToken } = require('../middlewares/autenticacion')
const _ = require('underscore')

let app = express();
let Producto = require('../models/producto');


//================================
// Mostrar todos las productos
//================================
app.get('/productos', verificaToken, (req, res)=>{
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    Producto.find({disponible: true})
            // .populate({path: 'categoria', select:'descripcion', populate: {path:'usuario', select:'nombre email'}})
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .skip(desde)
            .limit(limite)
            .exec((err, productoDB)=>{
                if (err) return res.status(500).json({ ok: false, err });
                Producto.count({disponible: true}, (err, conteo)=>{
                    res.json({
                        ok: true,
                        productos: productoDB,
                        cuantos: conteo
                    })
                })
            })
});

//================================
// Mostrar un producto
//================================
app.get('/producto/:id', verificaToken, (req, res)=>{
    let idProducto = req.params.id;
    Producto.findById(idProducto)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB)=>{
                if (err) return res.status(500).json({ ok: false, err });
                if (!productoDB) {
                    return res.status(400).json({
                        ok:false,
                        err:{
                            message:'producto no existe'
                        }
        
                    })
                }else{
                    res.json({
                        ok:true,
                        producto: productoDB
                    })
                }
            })
});

//================================
// Crear un producto
//================================
app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
    let termino = req.params.termino;
    let expresionRegular = new RegExp(termino, 'i')// es como el LIKE en SQL la 'i' significa que sea insensible a mayusculas y minisculas
    Producto.find({nombre: expresionRegular})
            .populate('categoria', 'descripcion')
            .exec((err, productoDB)=>{
                if (err) return res.status(500).json({ ok: false, err });
                res.json({
                    ok:true,
                    productos: productoDB
                })
            })


});

//================================
// Crear un producto
//================================
app.post('/producto', verificaToken, (req, res)=>{
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: true,
        categoria: req.body.categoria
    });
    producto.save((err, productoDB)=>{
        if (err) return res.status(500).json({ ok: false, err });
        res.status(201).json({
            ok:true,
            producto: productoDB
        })
        
    })
    
});

//================================
// Actualizar un producto
//================================
app.put('/producto/:id', verificaToken, (req, res)=>{
    let idProducto = req.params.id;
    let producto = _.pick(req.body, ['nombre', 'precioUni', 'disponible', 'descripcion', 'categoria']);
    Producto.findByIdAndUpdate(idProducto, producto, {new:true, runValidators:true}, (err, productoDB)=>{
        if (err) return res.status(500).json({ ok: false, err });
        if (!productoDB) {
            return res.status(400).json({
                ok:false,
                err
            })
        }else{
            res.json({
                ok:true,
                producto: productoDB
            })
        }
    })

});

//================================
// Elimina un producto
//================================
app.delete('/producto/:id', verificaToken, (req, res)=>{
    // solo actualizar no eliminar
    let idProducto = req.params.id;
    Producto.findByIdAndUpdate(idProducto, {disponible: false}, {new:true, runValidators:true}, (err, productoDB)=>{
        if (err) return res.status(500).json({ ok: false, err });
        if (!productoDB) {
            return res.status(400).json({
                ok:false,
                err:{
                    message:'producto no existe'
                }
            })
        }else{
            res.json({
                ok:true,
                producto: productoDB,
                message: 'Producto borrado'
            })
        }
    })
});


module.exports = app;