'use strict';

const User = require('../model/User');
const Match = require('../../matchs/model/Match');
const Bet = require('../../bets/model/Bet');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const console = require('better-console');

var computeBetScore = require('../util/scoreFunctions').computeBetScore;

module.exports = {
  method: 'GET',
  path: '/users/{userId}/score',
  config: {
    tags: ['api'],
      description: 'Compute the score for the bets of one user',
      notes: 'Returns the points obtained per bet',


      validate:{
          params: {

          userId : Joi.objectId()
                  .required()
                  .description('the ID of the user to fetch')

        },
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
        var betDom=[];
        var betExt=[];
        var scoreDom=[];
        var scoreExt=[];
        var matchpoints =0;
        var totalpoints =0;

      Bet
        .find({'userId': req.params.userId})
        .select('_id scoreDom scoreExt matchId')
        .populate({
          path: 'matchId', select:'scoreDom scoreExt',
        })
        .exec(function(err, bet){
            if(!err) {

              for (var i = 0; i < bet.length; i++) {

                if(bet[i].matchId !== null){

                       betDom[i] = bet[i].scoreDom;
                       betExt[i] = bet[i].scoreExt;
                       scoreDom[i] = bet[i].matchId.scoreDom;
                       scoreExt[i] = bet[i].matchId.scoreExt;

                       matchpoints = computeBetScore(scoreDom[i], scoreExt[i],betDom[i], betExt[i]);

                       Bet.findByIdAndUpdate(bet[i]._id, 
                       {$set: {score: matchpoints}},
                       {safe: true, upsert: true},
                        function(err, model) {
                          if(err){
                            console.log(err);
                          }
                           }
                       );

                       totalpoints += matchpoints
                }
              }

                    User.findByIdAndUpdate(req.params.userId, 
                    {$set: {points: totalpoints}}, 
                    {safe: true, upsert: true},
                      function(err, model) {
                        if(!err){
                          console.log(totalpoints);
      }
    });

        return res(totalpoints); // HTTP 200
            
      }
    return res(Boom.badRequest(err)); // 400 error
});     
    }  
  }
}

