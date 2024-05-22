const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//resolver las rutas statics
app.use(express.static("public"));

//Rutas motor de vistas ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

//Configuración base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'liberty'
}

module.exports = { app, PORT, dbConfig };