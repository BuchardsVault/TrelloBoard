const Card = require('../models/cardModel');
const db = require('../config/db');

// TODO:
// Need to set a const <table_name> to use in sql argument.
// Need to check if the correct table is being used.
// Need to check if there is a table to begin with.

getCards = async (req, res) => {
	try {
		const cards = await Card.getCards();
		res.json(cards);
	} catch (err) {
		console.error('Retrieval Error:', err);
		res.status(500).json({ error: 'Failed to get cards' });
	}
};

addCard = async (req, res) => {
	try {
		const cardData = req.body;
		await Card.addCard(cardData);
		res.json({ message: 'Card added successfully' });
	} catch (err) {
		console.error('Insert Error:', err);
		res.status(500).json({ error: 'Failed to insert card' });
	}
};

updateCard = async (req, res) => {
	try {
		const cardData = {
			id: req.params.id,
			status: req.body.status,
		};

		await Card.updateCard(cardData);
		res.json({ message: 'Card updated successfully' });
	} catch (err) {
		console.error('Update Error:', err);
		res.status(500).json({ error: 'Failed to update card' });
	}
};

deleteCard = async (req, res) => { };

module.exports = {
	getCards,
	addCard,
	updateCard,
	deleteCard
};
