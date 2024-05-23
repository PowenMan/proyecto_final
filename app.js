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

app.get('/single', (req, res) => {
    res.render('single');
});

//Ruta para insertar formulario contactos
app.post('/submitContacto', (req, res) => {
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

//Ruta para insertar formulario de Post
app.post('/submitPost', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    db.query('INSERT INTO pots (nombre, email, mensaje) VALUES (?, ?, ?)', [nombre, email, mensaje], (err, result) => {
        if(err) {
            console.log(err);
            res.send('Error al insertar post');
        }else {
            console.log(result);
            res.render('blog-single', {message: 'Gracias por comentar este post entra a verificación.'});
            //res.send('Usuario insertado con exito!');
        }
    });
});

//Ruta para listar los post
app.get('/blog-single', (req, res) => {
    const sql = 'SELECT * FROM pots';
    db.query(sql, (err, results) => {
        if(err) {
            return res.status(500).send('Error al listar los post');
        }
        const message = req.query.message || null;
        res.render('blog-single', { posts: results, message });
    });
});

module.exports = app;