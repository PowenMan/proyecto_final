const { app, PORT } = require('./config');
require('./app');

//Inicio server
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto:${PORT}`);
});