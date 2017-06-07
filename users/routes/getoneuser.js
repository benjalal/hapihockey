'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const console = require('better-console');

var computeBetScore = require('../util/scoreFunctions').computeBetScore;

module.exports = {
  method: 'GET',
  path: '/users/{userId}',
  config: {
    tags: ['api'],
      description: 'Get one user',
      notes: 'Returns the information of the user logged',

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
                    '404':{
                      description: 'NotFound'
                    }
                },
                payloadType: 'form'
            }
        },
    handler: (req, res) => {

        User
        .findById(req.params.userId)
        // Deselect the bets and version fields
        .select('-__v -bets')
        .exec((err, users) => {
          if (err) {
            return  res(Boom.badRequest(err)); //400 error
          }
          if(!users){
            return res(Boom.notFound('The user does not exist!')); //404 error
          }

          return res(users);
        });
    },
  // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
    }
  }
}