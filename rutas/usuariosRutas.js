var ruta=require("express").Router();
var {mostrarUsuarios, nuevoUsuario, modificaUsuario, buscarPorID, borrarUsuario}=require("../bd/usuariosBD");
var fs=require("fs");
var subirArchivo=require("../middlewares/subirArchivos");


ruta.get("/",async(req, res)=>{
    var usuarios = await mostrarUsuarios();
    //console.log(usuarios); //esta insturccion fue solo para saber que si hay conexion o manda alguna informacion 
    res.render("usuarios/mostrar",{usuarios});

});

ruta.get("/nuevousuario",async (req, res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario", subirArchivo(), async(req, res)=>{
    req.body.foto=req.file.originalname;
    var error= await nuevoUsuario(req.body);
    console.log(error);
    res.redirect("/");
});

ruta.get("/editar/:id",async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    res.render("usuarios/modificar",{user});
    console.log(user);
 
});

ruta.post("/editar", subirArchivo(), async(req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await modificaUsuario(req.body);
    res.redirect("/");
});

ruta.get("/borrar/:id", async(req, res)=>{
    var usuario=await buscarPorID(req.params.id)
    if(usuario){
        var foto=usuario.foto;
        fs.unlinkSync(`web/images/${foto}`);
    await borrarUsuario(req.params.id);
    }
    res.redirect("/")
});

module.exports=ruta;