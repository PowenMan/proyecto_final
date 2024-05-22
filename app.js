const { app } = require('./config');

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

module.exports = app;