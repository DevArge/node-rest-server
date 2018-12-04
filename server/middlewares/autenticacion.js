const jwt = require('jsonwebtoken')
//===================
// Verificar token
//===================

let verificaToken = (req, res, next)=>{
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
};

//===================
// Verificar ADMIN_ROLE
//===================

let verificaAdminRole = (req, res, next)=>{
    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok:false,
            err:{
                message: 'No posee permisos de ADMIN'
            }
        })
    }
  
    next();
};

//===================
// Verificar el token para imagenes
//===================
let verificaTokenImg = (req, res, next)=>{
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
}


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}