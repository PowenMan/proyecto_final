const { app } = require('./config');
const db = require('./db');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

//Ruta de las url
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    const message = req.query.message || null;
    res.render('contact', { message: null });
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

//Ruta para insertar formulario contactos
app.post('/SubmitContacto', (req, res) => {
    const { nombre, email, telefono, mensaje } = req.body;

    db.query('INSERT INTO contacts (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)', [nombre, email, telefono, mensaje], (err, result) => {
        if(err) {
            console.log(err);
            res.send('Error al insertar usuario');
        }else {
            console.log(result);
            res.render('contact', {message: 'Nos pondremos en contacto contigo en la brevedad.'});
            //res.send('Usuario insertado con exito!');
        }
    });
});

module.exports = app;