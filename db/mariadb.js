const mariadb = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mariadb.createConnection
({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'Bookstore',
    dataString: true
});

connection.connect
(
    err => 
    {
        if (err) { console.error('❌ DB 연결 실패:', err); return; }
        else { console.log('✅ DB 연결 성공'); }
    }
);

module.exports = connection;