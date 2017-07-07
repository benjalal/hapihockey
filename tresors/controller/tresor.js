'use strict';

const Tresor = require('../model/Tresor');
//const Match = require('../../matchs/model/Match');
const createTresorSchema = require('../schemas/createTresor');
const updateTresorSchema = require('../schemas/updateTresor');
const Boom = require('boom');
const User = require('../../users/model/User');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const console = require('better-console');
exports.getAll = {

  tags: ['api'],
      description: 'Get the tresor list',
      notes: 'Returns all the tresor item',

  plugins: {
            'hapi-swagger': {
                responses: {
                   '200':{ 
                      description: 'List of tresors'
                    },
                    '400': {
                        description: 'BadRequest'
                    }
                   
                },
                payloadType: 'form'
            }
        }
      ,

  handler: function (request, reply) {
    Tresor.find()
        .select('-__v ')
        .exec(function (err, tresor) {
      if (err) {
        return reply(Boom.badRequest(err)); //400 error
      }
      /*if(!bet.length){
          return reply('There are no bets') //HTTP 200
      }*/
      return reply(tresor); // HTTP 200
    })
  },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
    }
  
};

exports.create = {
    tags: ['api'],
      description: 'Create a tresor',
      notes: 'Insert a tresor document in the DB',

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
    //payload: createBetSchema,
  },
  handler: function (request, reply) {
      const today = new Date().getTime();
       var tresor = new Tresor(request.payload);
       //console.log(request.payload.user);
       tresor.save(function (err, tresor) {
      if (!err) {
        return reply(tresor).created('/tresor/' + tresor._id); // HTTP 201
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });

            
            User.findByIdAndUpdate(request.payload.user, {
        
            $push: {tresors: tresor}, function (err, user) {
                if (!err){
                    return reply(user); // HTTP 201
                }
                return reply(Boom.badImplementation(err)); // 500 error
            }
            
        },
        {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
    );
        
  },
  // Add authentication to this route
      auth: {
      strategy: 'token'
     // scope: ['admin']
    },
};

exports.getOne = {

  tags: ['api'],
      description: 'Get one tresor by its ID',
      notes: 'Returns one bet item',

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
        }
      ,
      validate: {

        params: {

          bet_id : Joi.objectId()
                  .required()
                  .description('the ID of the bet to fetch')

        }

      },
  handler: function (request, reply) {
    Tresor.findById(request.params.bet_id, function (err, bet) {
      if (!err) {
        return reply(bet);
      }
      return reply(Boom.badImplementation(err)); // 500 error
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
                    }
                },
                payloadType: 'form'
            }
        },
  validate: {
    payload: updateTresorSchema,

params: {

          bet_id : Joi.objectId()
                  .required()
                  .description('the ID of the BET to fetch')

        }

  },
  handler: function (request, reply) {
    Bet.findByIdAndUpdate(request.params.bet_id , request.payload, function (err, bet) {
      if (!err) {
            return reply('The changes were successfully added'); // HTTP 200
      
      }
      else{ 
        return reply(Boom.badImplementation(err)); // 500 error
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

          bet_id : Joi.objectId()
                  .required()
                  .description('the ID of the match to fetch')

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
    Bet.findByIdAndRemove(request.params.bet_id , function (err, bet) {
      if (!err && bet) {
        return reply({ message: "Bet deleted successfully"});
      }
      if (!err) {
        return reply(Boom.notFound()); //HTTP 404
      }
      return reply(Boom.badRequest("Could not delete bet"));
    });
  }
}