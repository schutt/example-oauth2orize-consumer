(function() {
  'use strict';

  const express = require('express');
  const path = require('path');
  const passport = require('passport');
  const request = require('request');

  const compression = require('compression');
  const cookieParser = require('cookie-parser');
  const session = require('express-session');

  const User = require('./user');
  const ExampleStrategy = require('./passport-example/strategy').Strategy;

  const port = process.argv[2] || 3001;
  const config = require('./oauth-config');
  const opts = require('./oauth-consumer-config');

  let server;

  // Passport session setup.
  // To support persistent login sessions, Passport needs to be able to
  // serialize users into and deserialize users out of the session. Typically,
  // this will be as simple as storing the user ID when serializing, and
  // finding the user by ID when deserializing.
  passport.serializeUser(function(user, done) {
    // TODO In a full example this would create a user record.
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    // TODO In a full example this would load a user record, instead of simply
    //      passing the object through.
    const user = obj;

    done(null, user);
  });

  passport.use(
    new ExampleStrategy({
        // The client ID and Secret need to match what is being used on the
        // OAuth server that this consumer is connecting to.
        clientID: opts.clientId,
        clientSecret: opts.clientSecret,
        callbackURL: config.consumer.protocol + '://' + config.consumer.host + '/auth/example-oauth2orize/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ profile: profile }, function(err, user) {
          user.accessToken = accessToken;
          return done(err, user);
        });
      })
  );

  // Configure the routes.
  const router = express.Router();

  router.get('/', (request, response) => response.render('index'));

  router.get('/error', (request, response) => response.render('error'));

  router.get('/success', (request, response) => response.render('success'));

  router.get(
    '/externalapi/account',
    function(req, res, next) {
      console.log('[using accessToken]', req.user.accessToken);

      const options = {
        url: config.provider.protocol + '://' + config.provider.host + config.provider.profileUrl,
        headers: {
          'Authorization': 'Bearer ' + req.user.accessToken
        }
      };

      function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
          res.end(body);
        } else {
          res.end('error: \n' + body);
        }
      }

      request(options, callback);
    }
  );

  router.get(
    '/auth/example-oauth2orize',
    passport.authenticate(
      'exampleauth', {
        scope: ['email']
      }
    )
  );

  router.get('/auth/example-oauth2orize/callback',
    passport.authenticate(
      'exampleauth', {
        // TODO Implement the failure redirect page.
        failureRedirect: '/close?error=foo'
      }
    )
  );

  router.get(
    '/auth/example-oauth2orize/callback',
    function(req, res) {
      console.log('req.session', req.session);
      const url = '/success';

      console.log(url);
      res.statusCode = 302;
      res.setHeader('Location', url);
      res.end('hello');
      // This will pass through to the static module
    }
  );

  router.post(
    '/auth/example-oauth2orize/callback',
    function(req, res) {
      console.log('req.user', req.user);
      res.end('thanks for playing');
    }
  );

  // Configure the Express application.
  const app = express();
  app
    .set('view engine', 'ejs')
    .use(express.query())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(compression())
    .use(cookieParser())
    .use(
      session({
        secret: config.app.sessionSecret,
        resave: false,
        saveUninitialized: false
      })
    )
    .use(passport.initialize())
    .use(passport.session())
    .use(router);

  module.exports = app;

  if (require.main === module) {
    server = app.listen(port, function() {
      console.log('Listening on', server.address());
    });
  }
}());
