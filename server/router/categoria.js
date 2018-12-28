const   express = require('express');
let { verificaToken,verificaAdminRol } = require('../middlewares/autenticacion');
let app = express();

let Categoria = require('../models/categoria');

//======================
//Mostrar todas la categorias
//======================

app.get('/categorias',verificaToken,(req,res)=>{
    
    Categoria.find({})
    .sort('description')
    .populate('usuario', 'nombre email')
    .exec( (err,categorias) =>{
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }
       return res.json({
           ok:true,
           categorias:categorias
       });
    });
});

//======================
//Mostrar todas la categorias por ID
//======================
app.get('/categorias/:id',verificaToken,(req,res)=>{
    // Caategoria.findById(...)

    let id = req.params.id;
    Categoria.findById(id ,(err,categorias) =>{
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if( !categorias ){
            return res.status(500).json({
                ok:false,
                err:{
                    message:"El Id no es correcto"
                }
            });
        }

       return res.json({
           ok:true,
           categoria:categorias
       })
    })
    
});


//======================
//Cfrear cateogoria
//======================
app.post('/categorias',verificaToken,(req,res)=>{
    // regresan la nueva categoria
    // req.usuario._id

    let body = req.body;
    let categoria = new Categoria({
        description:body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save( (err,categoriaBD)=>{
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if( !categoriaBD ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.status(200).json({
            ok:true,
            categoria: categoriaBD
        });
    });
});



//======================
//Actualizar catetoria
//======================
app.put('/categorias/:id',verificaToken,(req,res)=>{
    // regresan la nueva categoria
    // req.usuario._id
    
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        description: body.descripcion
    }

    Categoria.findByIdAndUpdate( id ,descCategoria, {new :true , runValidators:true}, (err,categoriaBD)=>{

        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if( !categoriaBD ){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.status(200).json({
            ok:true,
            categoria: categoriaBD
        });


    });

});

//======================
//Actualizar catetoria
//======================
app.delete('/categorias/:id',[verificaToken, verificaAdminRol],(req,res)=>{
    // Solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id , (err,CategoriaBd)=>{
        if( err ){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        return res.status(200).json({
            ok:true,
            categoria: CategoriaBd
        });
    });
    
});



module.exports  = app;
