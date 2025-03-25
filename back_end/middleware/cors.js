const allowedOrigins = [
    'http://localhost:3000',
    'https://trello.azurewebsites.net',
  ];
  
  const corsConfig = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    methods: ['GET', 'POST'],
  };
  
  module.exports = { corsConfig };