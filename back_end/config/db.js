const mysql = require('mysql2');
require('dotenv').config();

// Creates the user connection to the database.
const env_vars = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	namedPlaceholders: true
}

const pool = mysql.createPool(env_vars).promise();

// Reduces redundancy in query calls.
async function query(sql, params = []) {
	try {
		const [results] = await pool.execute(sql, params);
		return results
	} catch (err) {
		console.error('Database Query Error:', err);
		throw err;
	}
}

module.exports = { query };
