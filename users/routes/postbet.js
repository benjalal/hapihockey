'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
const Match = require('../../matchs/model/Match');
const createBetSchema = require('../../bets/schemas/createBet');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'POST',
  path: '/users/{userId}/bets',
  config: {
    tags: ['api'],
      description: 'Create a bet related to the user id',
      notes: 'Insert a bet document in the DB',


      validate:{

          payload: createBetSchema,

          params: {

          userId : Joi.objectId()
                  .required()
                  .description('the ID of the user which bets')

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
                    }
                },
                payloadType: 'form'
            }
        },
    handler: (request, reply) => {
      var bet = new Bet({userId: request.params.userId, matchId:request.payload.matchId, scoreDom:request.payload.scoreDom, 
          scoreExt: request.payload.scoreExt, closed : false});
       //console.log(request.payload.user);
       Match.findById(request.payload.matchId, function (err, match) {
      if (err) {
            return reply(Boom.badRequest(err)) //400 error
      }
      if(!match){
          return reply(Boom.notFound('the match you want to bet on does not exist!')) //404 error
      }
      if(match.closed == true){
          return reply('You can not bet on a match already finished!')
      }
      else{ 

          bet.save(function (err, bet) {
      if (!err) {
        return reply(bet).created('/bet/' + bet._id); // HTTP 201 created
      }
      return reply(Boom.badRequest('Could not create the bet')); // 400 error
    });

    User.findByIdAndUpdate(request.params.userId, {
        
            $push: {bets: bet}, function (err, user) {
                if (!err){
                    return reply(user); // HTTP 200
                }
                return reply(Boom.badImplementation(err)); // 500 error
            }
            
        },
        {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
    );

    Match.findByIdAndUpdate(request.payload.matchId, {
            
            $push: {bets: bet}, function (err, match) {
                if (!err){
                    return reply(match); // HTTP 200
                }
                return reply(Boom.badImplementation(err)); // 500 error
            }
            
        },
        {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
    );
          
      }
    });  
        
    },
    // Add authentication to this route
    auth: {
      strategy: 'token'
    },
  
  }
}

