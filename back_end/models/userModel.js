const db = require('../config/db');

const User = {
	getUsers: async () => {
		const sqlGet = `SELECT id, name FROM users`;

		try {
			const results = await db.query(sqlGet);
			console.log('All users: ', results);
			return results;
		} catch (err) {
			console.error('Error in getUsers:', err);
			throw err;
		}
	},

	addUser: async (userData) => {
		const sqlInsertNewUser = `INSERT INTO users (name, email) VALUES (?, ?)`;
		const userValues = [userData.name, userData.email];

		try {
			const results = await db.query(sqlInsertNewUser, userValues);
			return results;
		} catch (err) {
			console.error('Error in addUser:', err);
			throw err;
		}
	},
};

module.exports = User;
