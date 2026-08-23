const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Kosongkan karena XAMPP tidak pakai password
  database: 'db_kelurahan_mallawa',
  port: 3307,   // Sesuaikan dengan port MySQL di XAMPP Control Panel (default 3306)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();