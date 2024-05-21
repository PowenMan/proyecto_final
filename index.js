const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//resolver las rutas statics
app.use(express.static("public"));

//Rutas motor de vistas ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

//Ruta de las url
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

//Inicio server
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto:${PORT}`);
});