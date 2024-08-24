const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'bp7c1qkgysowdr1vvw8x-mysql.services.clever-cloud.com',
    user: 'umoorekkhbl7oudd',
    password: 'xelOVMnW7eI5ndrpRZ1k',
    database: 'bp7c1qkgysowdr1vvw8x'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database successfully!');
    }
    connection.end();
});
