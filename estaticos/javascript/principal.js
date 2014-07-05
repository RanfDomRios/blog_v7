//io existe a partir de que importamos socket.io.js
var socket = io.connect("http://localhost:8081");

socket.on("actualiza-contador",function(datosServidor){
	$("#contador").html(datosServidor.contador);
});

socket.on("mensaje-al-cliente",function(datosServidor){
	
	console.log("usuario:"+ datosServidor.usuario + ", mensaje:"+datosServidor.mensaje);
	
	var cajaNombre = "<span>"+ datosServidor.usuario + " dice: </span>";
	var caja = "<div class='mensaje'>" + cajaNombre + datosServidor.mensaje +"</div>";
	
	//append agrega el HTML al final del contenido de #mensajes
	$("#mensajes").append(caja);
});

//Escuchamos el click del boton del chat
//------------------------- Trea: cambiar a delegacion de eventos -----------------------
$(document).on("click","#boton",function() {
//$("#boton").click(function(){
	//val obtiene el texto que hayan escrito en el input
	var mensaje = $("#mensaje-usuario").val();
	var usuario = $("#nombre-usuario").val();
	
	//emit genera un evento (primer argumento)
	//que puede escuchar el servidor
	//alert("emitiendo");
	socket.emit("mensaje-al-servidor",{
		mensaje:mensaje,
		usuario:usuario
	});
});

//ME PERMITE ESCUCHAR CUANDO EL USUARIO ESTA USANDO
//LAS FLECHITAS HACIA ATRAS O HACIA ADELANTE
History.Adapter.bind(window,"statechange",function(){
	console.log("el usuario cambio url!!");
	
	//Este metodo regresa el estado (objeto) asociado
	//a la URL que se muestra en el navegador
	var estado = History.getState();
	var rutaAjax = estado.data.rutaAjax;
	$("#contenido-principal").load(rutaAjax);
});


//DELEGACION DE EVENTOS SUPER IMPORTANTE EN AJAX
$(document).on("click","#link-inicio",function() {
	
	History.pushState({
		rutaAjax : "/index-contenido"
	},"Inicio","/");
	
	//$("#contenido-principal").load("/inicio-contenido");

	//ESTO ES MUY IMPORTANTE EN AJAX
	//PARA EVITAR QUE OCURRA EL COMPORTAMIENTO POR DEFAULT
	//DEL ANCHOR <a>
	return false;
});

//TAREA CAMBIAR ESTE LINK A DELEGACION DE EVENTOS
$("#link-blog").click(function() {
	
	// history = es el nombre original del api del historial de html5
	// History (CON HA MAYUSCULA) es la libreria history.min.js
	//tercer argumento = URL que vamos a mostra en el navegador
	History.pushState({
		rutaAjax : "/blog-contenido"
	},"Blog","/blog");
	
	//$("#contenido-principal").load("/blog-contenido");

	//ESTO ES MUY IMPORTANTE EN AJAX
	return false;
});


$("#link-chat").click(function() {
	
	History.pushState({
		rutaAjax : "/chat-contenido"
	},"Blog","/chat");

	return false;
});


/*------- SOLUCION EJERCICIO AJAX:CONTACTO ----------------------*/

//TAREA CAMBIAR ESTE LINK A DELEGACION DE EVENTOS
$("#link-contacto").click(function() {
	
	History.pushState({
		rutaAjax : "/contacto-contenido"
	},"Contacto","/contacto");
	//$("#contenido-principal").load("/contacto-contenido");

	//ESTO ES MUY IMPORTANTE EN AJAX
	return false;
});

//DELEGACION DE EVENTOS
$(document).on("submit","#contactar-forma",function() {

	var datos = $("#contactar-forma").serialize();

    //AJAX OCURRE DE MANERA ASINCRONA
	$.ajax({
		url : "/contactar",
		data:datos,
		type:"POST",
		//callback que se ejecuta cuando el servidor YA NOS RESPONDIO
		success:function(datosDelServidor){
			
			alert(datosDelServidor);			
			$("#respuesta-servidor").html(datosDelServidor);			
		}
	});		
	
	//SIEMPRE PONER RETURN FALSE EN AJAX
	return false;
});