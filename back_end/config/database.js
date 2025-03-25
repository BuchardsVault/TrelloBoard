const mysql = require('mysql2/promise');
const fs = require('fs');

const serverCA = [fs.readFileSync('./DigiCertGlobalRootCA.crt.pem', 'utf8')];
const dbConfig = {
  host: "trellodb.mysql.database.azure.com",
  user: "myadmin",
  password: "SDSU@2025",
  database: "trello_db",
  port: 3306,
  ssl: { rejectUnauthorized: true, ca: serverCA },
};

module.exports = {
  pool: mysql.createPool(dbConfig),
};