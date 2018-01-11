module.exports = {
  // Define what OAuth 2.0 server should be used.
  provider: {
    protocol: 'http',
    host: 'localhost:3000',
    profileUrl: '/api/userinfo'
  },
  // Define this 'consumer' server.
  consumer: {
    protocol: 'http',
    host: 'localhost:3001'
  }
};
