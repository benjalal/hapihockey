'use strict';

const console = require('better-console');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Boom = require('boom');
const Match = require('../model/Match');
const Bet = require('../../bets/model/Bet');
const mongoose = require('mongoose');
const createMatchSchema = require('../schemas/createMatch');
const updateMatchSchema = require('../schemas/updateMatch');
const today = new Date().getTime();

exports.getAll = {
  //if(limite-today>0) Todo: return all the non ended matchs

  tags: ['api'],
      description: 'Get the match list',
      notes: 'Returns all the match item that are not yet finished',

  plugins: {
            'hapi-swagger': {
                responses: {
                   '200':{ 
                      description: 'List of matchs'
                    },
                    
                    '400':{
                      description: 'BadRequest'
                    }
                   
                },
                payloadType: 'form'
            }
        }
      ,

  handler: function (request, reply) {
    
    Match.find({"limite": {$gt:  today}})
         .select('-__v -limite -closed -bets') 
         .exec(function (err, match) {
      
        if (err) {
            return reply(Boom.badRequest(err)); //400 error
          }
          /*if (!match.length) {
            return reply('All the matchs are finished, you can not bet on them!'); //HTTP 200
          }*/
          return reply(match); // HTTP 200
    });
  },
  
};

exports.getOne = {

  tags: ['api'],
      description: 'Get one match by its ID',
      notes: 'Returns one match item',

  plugins: {
            'hapi-swagger': {
                responses: {
                    '400': {
                        description: 'BadRequest'
                    },
                    '200':{ 
                      description: 'Success'
                    },
                    '404' :{
                      description: 'NotFound'
                    }
                },
                payloadType: 'form'
            }
        }
      ,
      validate: {

        params: {

          matchId : Joi.objectId()
                  .required()
                  .description('the ID of the match to fetch')

        }

      },
  handler: function (request, reply) {
    Match.findById(request.params.matchId)
         .select('-limite -closed -__v -bets')
         .exec(function (err, match) {
      if (err) {
        return reply(Boom.badRequest(err)); // 400 error
        
      }
      if(!match){
        return reply(Boom.notFound('The match does not exist!')) //404 error
      }
      return reply(match); //HTTP 200
    });
  }
};

exports.getBet = {
tags: ['api'],
      description: 'Get the bets for the match id',
      notes: 'Returns the all the bets of one match',


      validate:{
          params: {

          matchId : Joi.objectId()
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
                    },
                    '404':{
                      description: 'NotFound'
                    }
                },
                payloadType: 'form'
            }
        },
    handler: (req, res) => {
      Bet
        //.findById(req.params.id)
        .find({"matchId" : req.params.matchId })
        //.select('-_id domicile exterieur bets')
        .select('-__v -match')
        //.populate({path: 'bets', select: '-__v'})
        .exec(function(err, bets){
            if(err) {
            return res(Boom.badRequest(err)); // 400 error
      }
            if(!bets.length){
              return res(Boom.notFound('There are no bets for this match')); // 404 error
            }
            return res(bets);; 
});   
        
    },
    // Add authentication to this route
    auth: {
      strategy: 'token'
    },
};

exports.create = {
  tags: ['api'],
      description: 'Create a match',
      notes: 'Insert a match item in the DB',

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
    payload: createMatchSchema
  },
  handler: function (request, reply) {
    var datelimite = new Date(request.payload.date).getTime();
    var match = new Match({date:request.payload.date, domicile: request.payload.domicile, exterieur:request.payload.exterieur, 
      limite : datelimite, closed : false});
    match.save(function (err, match) {
      if (!err) {
        return reply(match).created('/match/' + match._id); // HTTP 201
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
    console.log(datelimite);
    
  },
  auth: {
      strategy: 'token'

    }
};

exports.update = {
  tags: ['api'],
      description: 'Update a match by its ID',
      notes: 'Update a match document in the DB',

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
    payload: updateMatchSchema,
    params: {

          matchId : Joi.objectId()
                  .required()
                  .description('the ID of the match to fetch')

        }
  },
  handler: function (request, reply) {
    Match.findByIdAndUpdate(request.params.matchId , request.payload, function (err, match) {
      if (err) {

            return reply(Boom.badRequest('Could not update the match')); //400 error
      }
      if (!match){ 
        return reply(Boom.notFound('The match you want to update does not exist!')); // 404 error
      }
      return reply('The changes were successfully added'); // HTTP 200
    });
  },
  auth: {
      strategy: 'token'

    }
};

exports.remove = {
  tags: ['api'],
      description: 'Remove a match',
      notes: 'Delete a match item in the DB',

      validate: {
    params: {

          matchId : Joi.objectId()
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
                    },
                    '404':{
                      description: 'NotFound'
                    }
                },
                payloadType: 'form'
            }
        },
  handler: function (request, reply) {
    Match.findByIdAndRemove(request.params.matchId , function (err, match) {
      if (!err && match) {
        match.remove();
        return reply({ message: "Match deleted successfully"}); //HTTP 200
      }
      if (!match) {
        return reply(Boom.notFound('The match you want to delete does not exist')); //404 error
      }
      return reply(Boom.badRequest("Could not delete match")); //400 error
    });
  },
  auth: {
      strategy: 'token'

    }
};

exports.removeAll = {
  handler: function (request, reply) {
    mongoose.connection.db.dropCollection('matchs', function (err, result) {
      if (!err) {
        return reply({ message: "Match database successfully deleted"});
      }
      return reply(Boom.badRequest("Could not delete match database"));
    });
  }
};