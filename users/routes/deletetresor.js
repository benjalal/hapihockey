'use strict';

const User = require('../model/User');
const Tresor = require('../../tresors/model/Tresor');
//const Match = require('../../matchs/model/Match');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'DELETE',
  path: '/users/{userId}/tresors',
  config: {
    tags: ['api'],
      description: 'Delete a tresor',
      notes: 'Remove a tresor item from the DB',

      validate: {
    params: {

          userId : Joi.objectId()
                  .required()
                  .description('ID of the user which deletes his tresor')

        },

        payload:{
          tresorId : Joi.objectId()
                      .required()
                      .description('ID of the tresor')
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
    Tresor.findByIdAndRemove(request.payload.tresorId , function (err, bet) {
      if (!err && bet) {
        return reply({ message: "Tresor deleted successfully"}); //HTTP 200
      }
      if (!bet) {
        return reply(Boom.notFound()); //404 error
      }
      return reply(Boom.badRequest("Could not delete tresor")); //400 error
    });
  },
    // Add authentication to this route
    auth: {
      strategy: 'token'
    },
  
  }
}

