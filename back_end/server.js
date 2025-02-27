const express = require('express');
const app = express();

const PORT = 3000; // Or your chosen port
const HOST = '0.0.0.0'; // Accepts external connections

app.get('/', (req, res) => {
	res.send('This is the `cards` API');
});

app.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
});
