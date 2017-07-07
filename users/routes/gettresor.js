'use strict';

const User = require('../model/User');
const Tresor = require('../../tresors/model/Tresor');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'GET',
  path: '/users/{userId}/tresors',
  config: {
    tags: ['api'],
      description: 'Get the tresors for the user id',
      notes: 'Returns the all the tresors of one user',


      validate:{
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
                    }
                },
                payloadType: 'form'
            }
        },
    handler: (req, res) => {
      Tresor
        .find({"userId": req.params.userId})
        .select('-password -user -admin -__v -closed')
        //.populate({path: 'match', select: 'domicile exterieur date'})
        .exec(function(err, tresors){
            if(err) {
        return res(Boom.badRequest(err)); // 400 error
      }
            /*if(!bets.length){

              return res(Boom.notFound('The user has no bets'))
            }*/

            return res(tresors);
});   
        
    },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
      //scope: ['admin']
    },
  
  }
}

