'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


//const limite = new Date(dateString);

const createTresorSchema = Joi.object({

            position: Joi.string().required(),

            text: Joi.string().optional(),

            //image: Joi.

            //scoreDom: Joi.number().integer().required(),

            //scoreExt: Joi.number().integer().required(),

            //points: Joi.number().integer().optional(),

            //matchId: Joi.objectId().required().description('Id of the match'),

            //user: Joi.objectId().required()
});

module.exports = createTresorSchema;