var modelos = require("../modulos/modulos.js");

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

	function mostrarContacto(request, response, nombreVista) {
		response.render(nombreVista, {
			saludo : "contacto listo!!!"
		});
	}

	// /blog?PARAMETRO1=VALOR&PARAMETRO2=VALOR
	// /blog?limite=3&offset=3
	function mostrarBlog(request, response, nombreVista) {

		var criteriosBusqueda = {};
		// params = rutas dinamicas
		// body = para datos que vienen en el post de una dorma
		// query = para datos que vienen en el query string
		var limite = request.query.limite;
		var offset = request.query.offset;

		/*
		 	Operadores Malvados
		 		==		!=
		   	Operadores Buenos
		 	  	===		!===
		*/
		if ( typeof limite !== "undefined") {
			//si el query string limite trae datos, se los pegamos a los criterios de busqueda
			criteriosBusqueda.limit = limite;
		}

		if ( typeof offset !== "undefined") {
			//si el query string offset trae datos, se los pegamos a los criterios de busqueda
			criteriosBusqueda.offset = offset;
		}

		// con el metodo modelos.Articulo.count().success
		/*
		 qué habría que agregar a la vista?
		 y aquí en el controlador para hacer posible los links
		 de siguiente y atrás
		 */

		modelos.Articulo.findAll(criteriosBusqueda).success(function(articulos) {

			/*Cuando usan findAll, el metodo regresa un arreglo de JavaScript con todos los items*/
			var categorias = modelos.Categoria.findAll().success(function(categorias) {

				response.render(nombreVista, {
					//ASIGNAMOS LA VARIABLE ARTICULOS a articulos
					articulos : articulos,
					categorias : categorias
				});

			});

			//articulos= [];
		});
	}

	function mostrarChat(request, response, nombreVista) {
		response.render(nombreVista, {
			saludo : "contacto listo!!!"
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
		mostrarContacto(request, response, "contacto.html");
	});

	app.get("/contacto-contenido", function(request, response) {
		mostrarContacto(request, response, "contacto-contenido.html");
	});

	app.get("/chat", function(request, response) {
		mostrarChat(request, response, "chat.html");
	});

	app.get("/chat-contenido", function(request, response) {
		mostrarChat(request, response, "chat-contenido.html");
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

	// blog/1
	// blogh/2
	app.get("/blog/:articuloId([0-9]+)", function(request, response) {
		var articuloId = request.params.articuloId;

		console.log("Buscando articulo con Id:" + articuloId);

		//find RECIBE COMO ARGUMENTO EL ID A BUSCAR USANDO LA LLAVE PRIMARIA DE LA TABLA
		// ============== LA CONSULTA SE HACE DE MANERA ASINCRONA ===================
		modelos.Articulo.find({
			where : {
				id : articuloId
			},
			include : [{
				model : modelos.Comentarios,
				as : "comentarios"
			},
			//	 por medio del mapero N-N accedo a los comentarios
			{
				model : modelos.Categoria,
				as : "categorias"
			}]
			
		}).success(function(articulo) {
			//AQUI PONEMOS EL CODIGO A EJECUTAR CUANDO YA HIZO LA CONSULTA EN LA BASE
			response.render("articulo.html", {
				articulo : articulo
			});
		});
	});

	app.get("/usuario/:usuarioId([0-9]+)", function(request, response) {
		var usuarioId = request.params.usuarioId;
		modelos.Usuario.find({
			where : {
				id : usuarioId
			},
			include : [{
				model : modelos.Articulo,
				as : "articulos"
			}]
		}).success(function(usuario) {
			/*
				con lo anterior
					usuario.articulos 
				TIENE UN ARREGLO DE OBJETOS QUE SON LOS ARTICULOS ASOCIADOS A ESE USUARIO
			 */ 
			
			//AQUI PONEMOS EL CODIGO A EJECUTAR CUANDO YA HIZO LA CONSULTA EN LA BASE
			response.render("usuario.html", {
				usuario : usuario
			});
		});

	});

};
