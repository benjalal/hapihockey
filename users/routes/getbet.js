'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'GET',
  path: '/users/{id}/bets',
  config: {
    tags: ['api'],
      description: 'Get the bets for the user id',
      notes: 'Returns the all the bets of one user',


      validate:{
          params: {

          id : Joi.objectId()
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
        Bet
        .find({"user": req.params.id})
        .select('-password -user -admin -__v')
        .populate({path: 'match', select: 'domicile exterieur date'})
        .exec(function(err, bets){
            if(!err) {
        return res(bets);
      }
    return res(Boom.badImplementation(err)); // 500 error
});   
        
    },  
  }
}

