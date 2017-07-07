'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


//const limite = new Date(dateString);

const updateTresorSchema = Joi.object({
            scoreDom: Joi.number().integer().required(),

            scoreExt: Joi.number().integer().required(),

            tresorId: Joi.objectId().required().description('ID of the Tresor')

            //points: Joi.number().integer().optional(),

            //match: Joi.objectId(),

            //user: Joi.objectId()
});

module.exports = updateTresorSchema;