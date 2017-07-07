'use strict';

const User = require('../model/User');
const Tresor = require('../../tresors/model/Tresor');
//const Match = require('../../matchs/model/Match');
const createTresorSchema = require('../../tresors/schemas/createTresor');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'POST',
  path: '/users/{userId}/tresors',
  config: {
    tags: ['api'],
      description: 'Create a tresor related to the user id',
      notes: 'Insert a tresor document in the DB',


      validate:{

          payload: createTresorSchema,

          params: {

          userId : Joi.objectId()
                  .required()
                  .description('the ID of the user which adds the tresor')

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
      var tresor = new Tresor({userId: request.params.userId, position:request.payload.position,text:request.payload.text
           /*matchId:request.payload.matchId, scoreDom:request.payload.scoreDom, 
          scoreExt: request.payload.scoreExt, closed : false*/});
       //console.log(request.payload.user);
       /*Match.findById(request.payload.matchId, function (err, match) {
      if (err) {
            return reply(Boom.badRequest(err)) //400 error
      }
      if(!match){
          return reply(Boom.notFound('the match you want to bet on does not exist!')) //404 error
      }
      if(match.closed == true){
          return reply('You can not bet on a match already finished!')
      }
      else{ */

          tresor.save(function (err, tresor) {
      if (!err) {
        return reply(tresor).created('/tresor/' + tresor._id); // HTTP 201 created
      }
      return reply(Boom.badRequest('Could not create the tresor')); // 400 error
    });

    User.findByIdAndUpdate(request.params.userId, {
        
            $push: {tresors: tresor}, function (err, user) {
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

    /*Match.findByIdAndUpdate(request.payload.matchId, {
            
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
    );*/
          
      //}
    //});  
        
    },
    // Add authentication to this route
    auth: {
      strategy: 'token'
    },
  
  }
}

