/*module.exports = DEFINIR UN MODULO*/
module.exports.CONSTANTE1 = "valor1";

module.exports.configurar = function(app) {

	function mostrarInicio(request, response, nombreVista) {

		//response.send("bienvenido");
		response.render(nombreVista, {
			saludo : "Saludo dinamico",
			parametro2 : "otro valor"
		});
	}
	
	function mostrarContacto(request,response,nombreVista){
		response.render(nombreVista, {
			saludo:"contacto listo!!!"
		});
	}

	function mostrarBlog(request, response, nombreVista) {

		//AQUI SUPUESTAMENTE YA CONSULTAMOS UNA BASE DE DATOS
		//OBTENEMOS UN ARREGLO DE RESULTADOS
		var articulos = [{
			id : 1,
			titulo : "articulo 1",
			contenido : "contenido 1"
		}, {
			id : 2,
			titulo : "articulo 2",
			contenido : "contenido 2"
		}, {
			id : 3,
			titulo : "articulo 3",
			contenido : "contenido 3"
		}];

		var categorias = [{
			nombre : "categoria 1"
		}, {
			nombre : "categoria 2"
		}, {
			nombre : "categoria 3"
		}];

		//articulos= [];

		response.render(nombreVista, {
			//ASIGNAMOS LA VARIABLE ARTICULOS a articulos
			articulos : articulos,
			categorias : categorias
		});

	}
	
	function mostrarChat(request,response,nombreVista){
		response.render(nombreVista, {
			saludo:"contacto listo!!!"
		});
	}
	

	app.get("/", function(request, response) {
		mostrarInicio(request, response, "index.html");
	});

	app.get("/index-contenido", function(request, response) {
		mostrarInicio(request, response, "index-contenido.html");
	});

	app.get("/blog", function(request, response) {
		mostrarBlog(request, response, "blog.html");
	});
		
	app.get("/blog-contenido", function(request, response) {
		mostrarBlog(request, response, "blog-contenido.html");
	});

	app.get("/contacto", function(request, response) {
		mostrarContacto(request,response,"contacto.html");
	});
	
	app.get("/contacto-contenido", function(request, response) {
		mostrarContacto(request,response,"contacto-contenido.html");
	});
	
	app.get("/chat", function(request, response) {
		mostrarChat(request,response,"chat.html");
	});
	
	app.get("/chat-contenido", function(request, response) {
		mostrarChat(request,response,"chat-contenido.html");
});

	//HTTP TIENE GET, POST, TRACE, PUT, DELETE
	//GET ENVIA LOS DATOS EN LA CABEZERA DEL PAQUETE (tam limitado)
	//POST ENTIVA LOS DATOS EN EL CUERPO DEL PAQUETE HTTP (muchoos datos!!)
	//WIRESHARK PERMITE LEER EL CONTENIDO DE LOS PAQUETES :(
	//PARA EVITAR QUE NOS ROBEN INFORMACION USAMOS HTTPS

	app.post("/suscribir", function(request, response) {

		//REQUEST = ES PARA RECIBIR DATOS DEL USUARIO
		//RESPONSE = ES PARA ENVIAR UNA RESPUESTA AL USAURIO
		var email = request.body.email;

		response.send("se suscribio el email:" + email);

	});

	app.post("/contactar", function(request, response) {

		var email = request.body.email;
		var nombre = request.body.nombre;
		var url = request.body.url;
		var edad = request.body.edad;
		var comentario = request.body.comentario;

		var mensaje = "email:" + email + ", nombre:" + nombre + ",url:" + url + ",edad:" + edad + ",comentario:" + comentario;

		response.send(mensaje);

	});
	
};