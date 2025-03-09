const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.route('/')
	.get(cardController.getCards)
	.post(cardController.addCard);
//.put()
//.delete();

module.exports = router;

console.log(cardController);
