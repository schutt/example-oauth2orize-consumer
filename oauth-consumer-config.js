// Define the client configuration sent to the authentication server. The
// consumer client configuration needs to match the client configuration on the
// OAuth 2.0 server. This example is meant to be used with
// <https://github.com/gerges-beshay/oauth2orize-examples>, so the `clientId`
// and `clientSecret` must match one of the clients defined in that
// repository's `db/clients.js`.
module.exports = {
  name: 'Example Consumer App',
  icon: 'http://example.com/icon_64.png',
  clientId: 'abc123',
  clientSecret: 'ssh-secret'
};
