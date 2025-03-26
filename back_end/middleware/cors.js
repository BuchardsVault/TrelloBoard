const allowedOrigins = [
    'http://localhost:3000', // Allow to run on local machine 
    'https://trello.azurewebsites.net', // Allow to run from azure 
  ];
  
  /**
   * CORS: Cross Origin Resource Sharing
   *    Allows a server to indicate any originas other than its own 
   *    that a browser should allow to load. 
   */
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