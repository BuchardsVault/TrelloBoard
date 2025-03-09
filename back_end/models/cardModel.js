const db = require('../config/db');

const Card = {
	getCards: async () => {
		const sqlGet = `
			SELECT 
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
			LEFT JOIN users u2 ON c.designee_id = u2.id
		`;

		try {
			const results = await db.query(sqlGet);
			console.log('Results: ', results);
			return results;
		} catch (err) {
			console.error('Error in getCards:', err);
			throw err;
		}
	},

	addCard: async (cardData) => {
		const sqlInsertNewCard = `
			INSERT INTO cards (title, description, priority, status, author_id, designee_id)
			VALUES (?, ?, ?, ?, ?, ?)
		`;

		const sqlGetNewCard = `
			SELECT 
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
			LEFT JOIN users u2 ON c.designee_id = u2.id
			WHERE c.id = ?
		`;

		const cardValues = [
			cardData.title,
			cardData.description,
			cardData.priority,
			cardData.status,
			cardData.author_id,
			cardData.designee_id
		];

		try {
			const newCard = await db.query(sqlInsertNewCard, cardValues);
			const results = await db.query(sqlGetNewCard, [newCard.insertId]);
			return results;
		} catch (err) {
			console.error('Error in addCard:', err);
			throw err;
		}
	},

	// TODO: Refactor to `updateStatus`.
	updateCard: async (cardData) => {
		const sqlUpdate = `UPDATE cards SET status = ? WHERE id = ?`;
		const args = [cardData.status, cardData.id]
		try {
			const results = await db.query(sqlUpdate, args);
			return results;
		} catch (err) {
			console.error('Error in updateCard:', err);
			throw err;
		}
	},
};

module.exports = Card;
