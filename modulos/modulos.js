var Sequelize = require("sequelize");

//primer argumento es el nombre de la base
var sequelize = new Sequelize("database", "usuario", "password", {
	dialect : "sqlite", //mariadb, mysql, postgres
	//este parametro es solo para sqlite
	storage : __dirname + "/database.db",
	port : 3906, //este puerto sirve para mysql, para postgres - >5432

	define : {
		timestamps : false,
		freezeTableName : true
	}
});

/*	COMO SE HACE EN TODOS LOS LENGUJES
 var archivoFinal = obtenerArchivo("ruta");

 EN NODE.JS SE HACE
 LA SIGUIENTE LINEA SE EJECUTA DE MANERA ASINCRONA
 fs.obtenerArchivo(function(){});

 COMO LA CONSULTA DE ARCHIVOS ES ASINCRONA
 - puedo controlarlo con CALLBACKS ó con PROMESAS
 */

module.exports.configurar = function(callback) {
	console.log("Modulos Configurables");
	//aqui realmente no conectamos
	//cuando invocan authenticate (se ejecuta de manera asincrona), esto nos regresa un objeto de javascript
	//es una PROMESA
	sequelize.authenticate().complete(callback);
};

// -------------------------------- MAPEO DE TABLA A OBJETO -------------------------------------
var Articulo = sequelize.define("Articulo", {
	id : {
		//le decimos que ésta columna es la llave primaria de la tabla
		primaryKey : true,
		type : Sequelize.INTEGER
	},
	titulo : Sequelize.TEXT,
	contenido : Sequelize.TEXT,
	fecha_creacion : Sequelize.DATE
}, {
	tableName : "articulos"
});

var Usuario = sequelize.define("Usuario", {
	id : {
		//le decimos que ésta columna es la llave primaria de la tabla
		primaryKey : true,
		type : Sequelize.INTEGER
	},
	nombre : Sequelize.TEXT,
	email : Sequelize.TEXT,
	password : Sequelize.TEXT
}, {
	tableName : "usuarios"
});

var Categoria = sequelize.define("Categoria", {
	id : {
		//le decimos que ésta columna es la llave primaria de la tabla
		primaryKey : true,
		type : Sequelize.INTEGER
	},
	nombre : Sequelize.TEXT,
}, {
	tableName : "categorias"
});

var Comentarios = sequelize.define("Comentarios", {
	id : {
		//le decimos que ésta columna es la llave primaria de la tabla
		primaryKey : true,
		type : Sequelize.INTEGER
	},
	comentario : Sequelize.TEXT,
}, {
	tableName : "comentarios"
});

// ============================= MAPEO 1-N ===============================
// mapeo 1-N entre usuarios y articulos

// NOTA: Usuario y Articulo son modelos de Sequelize
Usuario.hasMany(Articulo, {
	// foreignKey es la columna que me permite relacionar
	// cada articulo con su respectivo dueño (un usuario)
	foreignKey : "usuario_id",
	// as me permite acceder a los articulos del usuario
	// haciendo usuario.articulos
	as : "articulos"
});

Articulo.hasMany(Comentarios,{
	foreignKey : "articulo_id",
	as : "comentarios"
});

// ============================ MAPEO N-N ===================================

Articulo.hasMany(Categoria,{
	foreignKey : "articulo_id",
	as :"categorias",
	// ESTO ES SOLO PARA N-N
	through:"categorias_articulos"
});

Categoria.hasMany(Articulo,{
	foreignKey : "categoria_id",
	as :"articulos",
	// ESTO ES SOLO PARA N-N
	through:"categorias_articulos"
});

//HACEMOS VISIBLE EL MODELO ASOCIADO A LA TABLA
module.exports.Articulo = Articulo;
module.exports.Usuario = Usuario;
module.exports.Categoria = Categoria;
module.exports.Comentarios = Comentarios;
