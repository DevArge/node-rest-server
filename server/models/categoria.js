const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion:{
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    usuario:{//LLAVE FORANEA USUARIO
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
module.exports = mongoose.model('Categoria', categoriaSchema);