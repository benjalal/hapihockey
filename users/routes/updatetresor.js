'use strict';

const User = require('../model/User');
//const Bet = require('../../bets/model/Bet');
//const Match = require('../../matchs/model/Match');
const Tresor = require('../../tresors/model/Tresor');
const updateTresorSchema = require('../../tresors/schemas/updateTresor');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'PUT',
  path: '/users/{userId}/bets',
  config: {
    tags: ['api'],
      description: 'Update a bet by its ID',
      notes: 'Update a bet document in the DB',

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
  validate: {
    payload: updateTresorSchema,

params: {

          userId : Joi.objectId()
                  .required()
                  .description('the ID of the user which modify his bet')

        }

  },
  handler: function (request, reply) {
    Bet.findById(request.payload.betId , function (err, bet) {
      if (err) {
            return reply(Boom.badRequest(err));
      
      }
      if(!bet){
            return reply(Boom.notFound('The bet you want to update does not exist'))
      }
      if(bet.closed == true){
          return reply('The bet you want to update is already closed')
      }
      else{ 
        Bet.findByIdAndUpdate(request.payload.betId, request.payload,function (err, bet) {
                if (err) {
            return reply(Boom.badRequest(err)) //400 error
      }

            return reply('The changes were successfully added'); // HTTP 200


          });
      }
    });
    
  },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
    },
  
  }
}

