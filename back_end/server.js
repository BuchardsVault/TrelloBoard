const express = require('express');
const app = express();
const cardRoutes = require('./routes/cardRoutes')

const PORT = 3000; // Or your chosen port
const HOST = '0.0.0.0'; // Accepts external connections

app.use("/api/cards", cardRoutes);

app.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
});
