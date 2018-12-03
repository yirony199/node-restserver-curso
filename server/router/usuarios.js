const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();




app.get('/', function (req, res) {
    res.json('Hello World')
})


app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Usuario.count({}, (err, conteo) =>{


                res.json({
                    ok: true,
                    usuarios,
                    cunatos: conteo
                })


            })

         
        });

})

app.post('/usuario', function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        // usuarioBD.password = null;
        return res.status(200).json({
            ok: true,
            usuario: usuarioBD
        });
    });


})


app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, [
        'nombre',
        'email',
        'img',
        'role',
        'estado'
    ]);


    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        })
    });


})

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, UsuarioBorrado)=>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if(!UsuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: UsuarioBorrado
        });

    })
})



module.exports = app;