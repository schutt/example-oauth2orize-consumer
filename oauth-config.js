'use strict';

module.exports = {
  //oAuth server config
	provider: {
		protocol: "http", 
		host: "localhost:3000",
		profileUrl: "/api/userinfo"
	}, 
  //client config
	consumer: {
		protocol: "http", 
		host: "localhost:3001"
	}
};
