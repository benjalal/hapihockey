'use strict';

const User = require('../model/User');
const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: 'DELETE',
  path: '/users/{userId}',
  config: {
    tags: ['api'],
      description: 'Delete a user',
      notes: 'Removes a user from the DB, must be logged as admin',

      validate: {
    params: {

          userId : Joi.objectId()
                  .required()
                  .description('the ID of the user to fetch')

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
                    '404': {
                      description: 'NotFound'
                    }
                },
                payloadType: 'form'
            }
        },
    handler: (req, res) => {
      User.findByIdAndRemove(req.params.userId , function (err, user) {
      if (!err && user) {
        return res({ message: "User deleted successfully"});
      }
      if (!user) {
        return res(Boom.notFound('The user does not exist!')); //HTTP 404
      }
      return res(Boom.badRequest("Could not delete user"));
    });
    },
  
  }
}