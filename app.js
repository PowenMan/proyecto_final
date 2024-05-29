const { app } = require('./config');
const db = require('./db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));

//Middleware para proteger rutas
function isAthenticated(req, res, next){
    if(req.session.usuario){
        return next();
    }else{
        res.redirect('/login');
    }
}

//Ruta destruir session
app.get('/logout', (req, res) => {
    req.session.destroy((e) => {
        if(e){
            console.error(e);
            return res.status(500).send('Error al cerrar session');
        }
        res.redirect('/login');
    });
});

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
            res.redirect('/blog-single?message=Gracias por comentar este post entra a verificación.');
            //res.send('Usuario insertado con exito!');
        }
    });
});

//Ruta para listar los post
app.get('/blog-single', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const sql = 'SELECT * FROM pots LIMIT ? OFFSET ?';
    db.query(sql, [limit, offset], (err, results) => {
        if(err) {
            return res.status(500).send('Error al listar los post');
        }

        const countSql = 'SELECT COUNT(*) AS count FROM pots';
        db.query(countSql, (err, countResult) => {
            if(err) {
                return res.status(500).send('Error al contar los post');
            }
            const totalPosts = countResult[0].count;
            const totalPages = Math.ceil(totalPosts / limit);
            const message = req.query.message || null;

            res.render('blog-single', { posts: results, totalPosts: totalPosts, message, totalPages, currentPage: page });
        });
    });
});

//Rutas administrativas
app.get('/admin', isAthenticated, (req, res) => {
    const countPostsSql = 'SELECT COUNT(*) AS count FROM pots';
    const countContactsSql = 'SELECT COUNT(*) AS count FROM contacts';

    db.query(countPostsSql, (err, postsCountResult) => {
        if(err){
            return res.status(500).send('Error al momento de contar los post');
        }
        const totalPosts = postsCountResult[0].count;

        db.query(countContactsSql, (err, contactsCountResult) => {
            if(err){
                return res.status(500).send('Error al momento de contar los contactos');
            }
            const totalContacts = contactsCountResult[0].count;

            res.render('admin', { totalPosts, totalContacts });
        });
    });
});

//Ruta listar post
app.get('/listar-post', (req, res) => {
    db.query('SELECT * FROM pots', (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Error al listar los post');
        }else {
            console.log(result);
            res.render('listar-post', { posts: result });
        }
    });
});

//Ruta listar contactos
app.get('/listar-contactos', (req, res) => {
    db.query('SELECT * FROM contacts ', (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Error al listar los contactos');
        }else {
            console.log(result);
            res.render('listar-contactos', { contacts: result });
        }
    });
});

//Ruta eliminar contacto
app.post('/delete-contact', (req, res) => {
    const { id } = req.body;

    db.query('DELETE FROM contacts WHERE id = ?', [id], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Error al eliminar contacto');
        }else {
            console.log(result);
            res.redirect('/listar-contactos');
            //res.send('Usuario insertado con exito!');
        }
    });
});

//Ruta editar contacto
app.get('/edit-contact/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM contacts WHERE id = ?', [id], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Error al consultar contacto');
        }else {
            console.log(result);
            res.render('edit-contact', { contacts: result[0] });
            //res.send('Usuario insertado con exito!');
        }
    });
});

//Ruta actualizar contacto
app.post('/update-contact/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, mensaje } = req.body;
    db.query('UPDATE contacts SET nombre = ?, email = ?, telefono = ?, mensaje = ? WHERE id = ?', [ nombre, email, telefono, mensaje, id], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Error al actualizar contacto');
        }else {
            console.log(result);
            res.redirect('/listar-contactos');
            //res.send('Usuario insertado con exito!');
        }
    });
});

//Ruta de logueo
app.get('/login', (req, res) => {
    res.render('login');
});

//Ruta de logueo
app.get('/registro', (req, res) => {
    res.render('registro');
});

//Ruta de registro
app.post('/registro', async (req, res) => {
    const { nombre, email, contraseña } = req.body;
    const hashedContaseña = await bcrypt.hash(contraseña, 10);

    db.query('INSERT INTO usuarios (nombre_usuario, email, contraseña) VALUES (?, ?, ?)', [nombre, email, hashedContaseña], (err, result) => {
        if(err) {
            console.log(err);
            res.send('Error al registrar usuario');
        }else {
            console.log(result);
            res.redirect('login');
            //res.send('Usuario insertado con exito!');
        }
    });
});

//Ruta de login
app.get('/login', (req, res) => {
    res.render('login');
});

//Ruta de iniciar session
app.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ? AND estado = 1', [email], async (err, result) => {
        if(err) {
            console.log(err);
            res.send('Error al iniciar session');
        }else {
            if(result.length > 0){
                const usuario = result[0];
                if(await bcrypt.compare(contraseña, usuario.contraseña)){
                    req.session.usuario = usuario;
                    res.redirect('/admin');
                }else{
                    res.send('Credenciales incorrectas');
                }
            } else {
                res.send('Usuario no encontado o no esta activo');
            }
        } 
    });
});

module.exports = app;