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

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/service', (req, res) => {
    res.render('service');
});

app.get('/blog', (req, res) => {
    res.render('blog');
});

app.get('/blog-single', (req, res) => {
    res.render('blog-single');
});

app.get('/single', (req, res) => {
    res.render('single');
});

//Inicio server
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto:${PORT}`);
});