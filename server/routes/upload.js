const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok:false,
            err:{
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    // VALIDAR TIPO
    let tiposValidos = ['productos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

    //EXTENSIONES PERMITIDAS
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok:false,
            err:{
                message: 'las extensiones validas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }
    // CAMBIAR EL NOMBRE DEL ARCHIVO
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err)=> {
        if (err){ 
          return res.status(500).json({
              ok:false,
              err
          });
        }
        // AQUI YA ESTA LA IMAGEN CARGADA
        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }else{
            imagenUsuario(id, res, nombreArchivo);
        }
      });
});

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB)=>{
        if(err){
            borrarArchivo(nombreArchivo, 'usuarios')
            res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuarios')
            res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            })
        }
    // SE VERIFICA QUE LA IMAGEN EXISTA PARA BORRARLA Y ACTUALIZARLA
        borrarArchivo(usuarioDB.img, 'usuarios')
    ///////////////////////////////////////////////////////
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB)=>{
        if(err){
            borrarArchivo(nombreArchivo, 'productos')
            res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            borrarArchivo(nombreArchivo, 'productos')
            res.status(400).json({
                ok:false,
                err:{
                    message:'Producto no existe'
                }
            })
        }
    // SE VERIFICA QUE LA IMAGEN EXISTA PARA BORRARLA Y ACTUALIZARLA
        borrarArchivo(productoDB.img, 'productos')
    ///////////////////////////////////////////////////////
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado)=>{
            res.json({
                ok:true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

function borrarArchivo(nombreImagen, tipo){
    // SE VERIFICA QUE LA IMAGEN EXISTA PARA BORRARLA Y ACTUALIZARLA
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);// para borrar la imagen
    }
}
module.exports = app;