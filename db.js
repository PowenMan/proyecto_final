const mysql = require('mysql');
const { dbConfig } = require('./config');

//Crear la conexion a la base de datos
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if(err){
        console.error('Error al conectar con al base de datos!!!');
        return;
    }
    console.log('Conección a la base de datos exitoso!!!');
});

module.exports = connection;