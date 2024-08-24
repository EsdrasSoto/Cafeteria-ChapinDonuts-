const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Configurar body-parser para manejar datos de solicitud POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'bp7c1qkgysowdr1vvw8x-mysql.services.clever-cloud.com',
    user: 'umoorekkhbl7oudd',
    password: 'xelOVMnW7eI5ndrpRZ1k',
    database: 'bp7c1qkgysowdr1vvw8x'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) throw err;
    console.log('Conexión establecida exitosamente!');
});

// Servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para manejar el login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta a la base de datos
    connection.query('SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?', [username, password], (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        if (rows.length > 0) {
            // Usuario autenticado
            res.json({ success: true, message: 'Login exitoso' });
        } else {
            // Usuario no autenticado
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Ruta para manejar el registro de usuarios
app.post('/register', (req, res) => {  // Endpoint corregido aquí
    const { username, password, role } = req.body;

    // Validar que el rol es válido
    if (role !== 'admin' && role !== 'vendedor') {
        return res.status(400).json({ success: false, message: 'Rol no válido' });
    }

    // Consulta para insertar el nuevo usuario en la base de datos
    connection.query('INSERT INTO usuarios (usuario, contrasenia, roles) VALUES (?, ?, ?)', [username, password, role], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        // Devolver el id_usuario generado
        res.json({ success: true, message: 'Usuario registrado exitosamente', id_usuario: result.insertId });
    });
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    connection.query('SELECT id_usuario, usuario, roles FROM usuarios', (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        res.json(rows);
    });
});

// Ruta para obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT id_usuario, usuario, roles FROM usuarios WHERE id_usuario = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// Ruta para actualizar un usuario por ID
app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    if (role !== 'admin' && role !== 'vendedor') {
        return res.status(400).json({ success: false, message: 'Rol no válido' });
    }

    connection.query('UPDATE usuarios SET usuario = ?, contrasenia = ?, roles = ? WHERE id_usuario = ?', [username, password, role, id], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Usuario actualizado exitosamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// Ruta para eliminar un usuario por ID
app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
