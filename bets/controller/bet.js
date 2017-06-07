'use strict';

const Bet = require('../model/Bet');
const Match = require('../../matchs/model/Match');
const createBetSchema = require('../schemas/createBet');
const updateBetSchema = require('../schemas/updateBet');
const Boom = require('boom');
const User = require('../../users/model/User');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const console = require('better-console');
exports.getAll = {

  tags: ['api'],
      description: 'Get the bet list',
      notes: 'Returns all the bet item',

  plugins: {
            'hapi-swagger': {
                responses: {
                   '200':{ 
                      description: 'List of bets'
                    },
                    '400': {
                        description: 'BadRequest'
                    },
                   
                },
                payloadType: 'form'
            }
        }
      ,

  handler: function (request, reply) {
    Bet.find()
        .select('-__v ')
        .exec(function (err, bet) {
      if (err) {
        return reply(Boom.badRequest('Could not get the bet list')); //400 error
      }
      /*if(!bet.length){
          return reply('There are no bets') //HTTP 200
      }*/
      return reply(bet); //HTTP 200
    })
  },
  
};

exports.create = {
    tags: ['api'],
      description: 'Create a bet',
      notes: 'Insert a bet document in the DB',

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
    validate: {
    payload: createBetSchema,
  },
  handler: function (request, reply) {
     // const today = new Date().getTime();
       var bet = new Bet({scoreDom : request.payload.scoreDom, scoreExt: request.payload.scoreExt,
           matchId: request.payload.matchId, userId:request.payload.userId, closed : false });
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

    User.findByIdAndUpdate(request.payload.userId, {
        
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
};

exports.getOne = {

  tags: ['api'],
      description: 'Get one bet by its ID',
      notes: 'Returns one bet item',

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
        }
      ,
      validate: {

        params: {

          betId : Joi.objectId()
                  .required()
                  .description('the ID of the bet to fetch')

        }

      },
  handler: function (request, reply) {
    Bet.findById(request.params.betId)
       .select('-closed -__v ')
       .exec(function (err, bet) {
      if (err) {
        return reply(Boom.badRequest('Could not get the bet'))
      }
      if(!bet){
          return reply(Boom.notFound('The bet does not exist!'))
      }

      return reply(bet);
    });
  }
};

exports.update  = {

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
    payload: updateBetSchema,

params: {

          betId : Joi.objectId()
                  .required()
                  .description('the ID of the BET to fetch')

        }

  },
  handler: function (request, reply) {
    Bet.findById(request.params.betId , function (err, bet) {
      if (err) {
            return reply(Boom.badRequest(err)) //400 error
      }
      if(!bet){
          return reply(Boom.notFound('the bet you want to update does not exist!')) //404 error
      }
      if(bet.closed == true){
          return reply('The bet you want to update is already closed')
      }
      else{ 

          Bet.findByIdAndUpdate(request.params.betId, request.payload,function (err, bet) {
                if (err) {
            return reply(Boom.badRequest(err)) //400 error
      }

            return reply('The changes were successfully added'); // HTTP 200


          });
          
      }
    });
    
  }

};

exports.remove = {
  tags: ['api'],
      description: 'Delete a bet',
      notes: 'Remove a bet item from the DB',

      validate: {
    params: {

          betId : Joi.objectId()
                  .required()
                  .description('the ID of the bet to fetch')

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
  handler: function (request, reply) {
    Bet.findByIdAndRemove(request.params.betId , function (err, bet) {
      if (!err && bet) {
        return reply({ message: "Bet deleted successfully"});
      }
      if (!bet) {
        return reply(Boom.notFound('The bet you want to delete does not exist!')); //HTTP 404
      }
      return reply(Boom.badRequest("Could not delete bet"));
    });
  }
}