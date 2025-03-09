const db = require('../config/db');

const Card = {
	getCards: async () => {
		const sql = `SELECT 
						c.id,
						c.title,
						c.description,
						c.priority,
						c.status,
						u1.name AS author,
						u2.name AS designee,
						c.author_id,
						c.designee_id
						FROM cards c
						LEFT JOIN users u1 ON c.author_id = u1.id
						LEFT JOIN users u2 ON c.designee_id = u2.id`

		try {
			const results = await db.query(sql);
			console.log('Results:', results);
			return results;
		} catch (err) {
			console.error('Error in getCards:', err);
			throw err;
		}
	},

	addCard: async (cardData) => {
		try {
			// TODO: Match fields with the columns in the Cards table.
			// const sql = `INSERT INTO <table_name> (___, ___, ___) VALUES (?, ?, ?)`;
			// const result = await db.query(sql, [cardData.___, cardData.___, cardData.___]);
			console.log('Insert result:', result);
			return result;
		} catch (err) {
			console.error('Error in addCard:', err);
			throw err;
		}
	},

	getDatabase: async () => {
		try {
			const results = await db.query('SELECT DATABASE();');
			console.log('Results:', results);
			return results;
		} catch (err) {
			console.error('Error in getDatabase:', err);
			throw err;
		}
	}
};

module.exports = Card;
