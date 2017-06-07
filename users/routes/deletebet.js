'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
const Match = require('../../matchs/model/Match');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'DELETE',
  path: '/users/{userId}/bets',
  config: {
    tags: ['api'],
      description: 'Delete a bet',
      notes: 'Remove a bet item from the DB',

      validate: {
    params: {

          userId : Joi.objectId()
                  .required()
                  .description('ID of the user which deletes his bet')

        },

        payload:{
          betId : Joi.objectId()
                      .required()
                      .description('ID of the bet')
        }
  },

  plugins: {
            'hapi-swagger': {
                responses: {
                    '400': {
                        description: 'BadRequest'
                    },
                    '200':{ 
                      description: 'Success'
                    },
                    '404':{
                      description: 'NotFound'
                    }
                },
                payloadType: 'form'
            }
        },
  handler: function (request, reply) {
    Bet.findByIdAndRemove(request.payload.betId , function (err, bet) {
      if (!err && bet) {
        return reply({ message: "Bet deleted successfully"}); //HTTP 200
      }
      if (!bet) {
        return reply(Boom.notFound()); //404 error
      }
      return reply(Boom.badRequest("Could not delete bet")); //400 error
    });
  },
    // Add authentication to this route
    auth: {
      strategy: 'token'
    },
  
  }
}

