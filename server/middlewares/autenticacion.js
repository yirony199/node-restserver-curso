const jwt = require('jsonwebtoken');


//===============================
//Verificacion de token 
//===============================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    });


}

//===============================
//Verifican asmin rol
//===============================


let verificaAdminRol = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role == "ADMIN_ROLE") {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: "El usuario no tiene permiso para crear usuarios"
        })
    }



}



//===============================
//Verifican token para imagen
//===============================


let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}