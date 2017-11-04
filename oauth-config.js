'use strict';

module.exports = {
  //oAuth server config
	provider: {
		protocol: "http", 
		host: "local.foobar3000.com:3001",
		profileUrl: "/api/userinfo"
	}, 
  //client config
	consumer: {
		protocol: "http", 
		host: "local.helloworld3000.com:3002"
	}
};
