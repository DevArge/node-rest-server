let Categoria = require('../models/categoria');

let index = (req, res)=>{
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, categoriasDB)=>{
            if (err) {
                res.status(500).json({
                    ok:false,
                    err
                })
            }
            res.json({
                categorias: categoriasDB
            })
        })
}

module.exports = {
    index
}