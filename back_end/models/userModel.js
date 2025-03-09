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

	addUser: async (userData) => { },
};

module.exports = User;
