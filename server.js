'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const console = require('better-console');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const privateKey = require('./config');
const Util = require('util');
const jwt = require('jsonwebtoken');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
//const ttl = 1 * 30 * 1000 * 60; //1 hour

const server = new Hapi.Server();

const swaggerOptions = {
    info: {
            'title': 'Hockey Bet API Documentation',
            'version': '1.0',
            'description' : 'An API to bet on the Swiss Ice Hockey championship'
        },

         documentationPath: '/doc',
         securityDefinitions: {
        'token': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },  
    //security: [{ 'token': [] }],
    tags: [
        {
            description: 'Hapi Hockey operations',
            name: 'hapihockey'
        }
    ]
    };

// The connection object takes some
// configuration, including the port
server.connection({ port: 8000 });

//declare mongoDB
const dbUrl = 'mongodb://localhost:27017/hapi-hockey';


function validate(req, decoded, callback) {
  const token = req.headers.authorization;
  console.log(token);
  var parts = token.split(/\s+/);
  console.log(parts[1]);
    var decoded = jwt.verify(parts[1], privateKey);
    console.log(decoded);
    console.log(decoded.tokenData);
    const credentials = (decoded.tokenData);
    //var decoded = jwt.decode(token);
    console.log(credentials.scope);
  //verify if the user is an admin or if his id corresponds to the id in the request
  if (credentials.scope !== 'admin' && credentials.id !== req.params.userId) {
        return callback(null, false);
    }

    return callback(null, true, credentials)
}

server.register([
    Inert,
    Vision,
    require('hapi-auth-jwt'),

    {
    register: HapiSwagger,
    options: swaggerOptions
  
}], function(err) {
    server.auth.strategy('token', 'jwt', {
        key: privateKey,
        validateFunc: validate,
        verifyOptions: { algorithms: ['HS256']}
    });

  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  glob.sync('**/routes/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  Util.log(`Server started on port 8000`);
  // Once started, connect to Mongo through Mongoose
  mongoose.connect(dbUrl, {}, (err) => {
    if (err) {
      throw err;
    }
  });
});

module.exports = server;