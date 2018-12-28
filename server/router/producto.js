const express = require('express');
const {
    verificaToken
} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//=================================
// Obtener productos
//=================================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los porductos
    //populate:Usuario

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({disponible: true})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                productos: productos
            });
        });
});



//=================================
// Obtener productos por id
//=================================


app.get('/productos/:id', verificaToken, (req, res) => {
    // trae todos los porductos
    //populate:Usuario

    let id = req.params.id;

    Producto.findById(id, (err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(productos.disponible){
                return res.status(200).json({
                    ok: true,
                    productos: productos
                });
            }else{
                return res.status(500).json({
                    ok: false,
                    err: {
                        message:"El prducto no se encuentra habilitada"
                    }
                });
            }

            
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'description');
});



//=================================
// crear un nuevo producto
//=================================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto();
    producto.nombre = body.nombre;
    producto.precioUni = body.precioUni;
    producto.descripcion = body.descripcion;
    producto.categoria = body.categoria;
    producto.usuario = req.usuario._id;
    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        return res.status(200).json({
            ok: true,
            producto
        });
    });
   

});



app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let productoUpdate  = {};
    productoUpdate.nombre = body.nombre;
    productoUpdate.precioUni = body.precioUni;
    //productoUpdate.disponible = body.disponible;
    productoUpdate.descripcion = body.descripcion;
    Producto.findByIdAndUpdate( id, productoUpdate,  {new :true , runValidators:true},  (err, productoBD) => {
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if( !productoBD ){
            return res.status(400).json({
                ok:false,
                err :{
                    message:"El ID no existe"
                }
            });
        }
        return res.status(200).json({
            ok:true,
            producto: productoBD
        });

    });
    

});

app.delete('/productos/:id',verificaToken,(req,res)=>{
    // Solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;

    Producto.findByIdAndUpdate( id, { disponible: false },  {new :true , runValidators:true},  (err, productoBD) => {
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if( !productoBD ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.status(200).json({
            ok:true,
            producto: productoBD
        });

    });
});



app.get('/productos/buscar/:termino',verificaToken, (req,res)=>{

    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');

    Producto.find({ nombre: regex })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'description')   
    .exec( (err,productos) =>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        return res.status(200).json({
            ok:true,
            productos
        });

    })

});



module.exports = app;