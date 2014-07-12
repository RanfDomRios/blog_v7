//importamos la libreria de EXPRESS
var express = require("express");
//importamos la libreria de NUNJUCKS
var nunjucks = require("nunjucks");
//importamos la libreria de SERVINDEX
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");

var socketio = require("socket.io");

var sanitizer = require("sanitizer");

//----------- librería CORE de NODE ----------
var http = require("http");

//Esto habilita el poder recibir datos por http-post
//express tambien tiene el body parser --> nunca nunca usar body parser porque se incluye el manejo MULTI-PARSER.
//usar para este caso URLENCODED
var bodyParser = require("body-parser");

/*importamos nuestros modulos*/
var rutas = require("./rutas/rutas.js");
var modulos = require("./modulos/modulos.js");

console.log("constante 1 valor:" + rutas.CONSTANTE1);

//creamos al servidor WEB
var app = express();
//Esto lo hacemos para poder usar websockets
var servidor = http.createServer(app);

//CONFIGURAMOS NUNJUCKS PARA TRABAJAR CON EXPRESS
nunjucks.configure(__dirname + "/vistas", {
	express : app
});

//El app.use da de alta un middleware en express
//muestra los recursos de la carpeta /estaticos
//primer argumento -> nombre logico (alias)
//segundo argumento -> ruta real de la carpeta
app.use("/estaticos", serveStatic(__dirname + "/estaticos"));
app.use("/estaticos", serveIndex(__dirname + "/estaticos"));

app.use(bodyParser());

rutas.configurar(app);
modulos.configurar(function(){
	//cuando ya está lista la conexion entonces ahora sí escucho peticiones de los usuarios
	servidor.listen(8081);
});

//Habilita WEBSOCKETS en el servidor con SOCKET.IO
//io me prermite escuchar y responder a mis clientes usando websockets
var io = socketio.listen(servidor);
//app.listen(8081);

//cuando alguien ponga http://localhost:8081/

console.log("servidor web listo");

//-------------------INICIA CHAT -----------------------
//conection me permite escuchar cuando un cliente se conecta
//cuando un cliente se conecta SOCKET.IO nos para un objeto en la funcion que sepresenta al cliente
var contadorUsuarios = 0;
io.sockets.on("connection", function(socket) {

	contadorUsuarios++;
	console.log("SE CONECTO UN CLIENTE");

	socket.emit("actualiza-contador", {
		contador : contadorUsuarios
	});

	socket.on("disconnect", function() {
		contadorUsuarios--;

		socket.emit("actualiza-contador", {
			contador : contadorUsuarios
		});
		console.log("se desconecto un cliente");

	});

	socket.on("mensaje-al-servidor", function(datosCliente) {
		//limpiamos los datos del cliente de un probable ataque
		//de XSS
		var mensaje = sanitizer.escape(datosCliente.mensaje);
		var usuario = sanitizer.escape(datosCliente.usuario);
		
		//console.log("usuario" + datosCliente.usuario + ", mensaje:" + datosCliente.mensaje);

		io.sockets.emit("mensaje-al-cliente",{
			mensaje:mensaje,
			usuario:usuario
		});
	});

});
