'use strict';

const Match = require('../controller/match');




module.exports = ([

    { method: 'GET', path: '/matchs', config: Match.getAll},
    
    { method: 'POST', path: '/matchs', config:  Match.create }, 

    { method: 'GET', path: '/matchs/{matchId}', config: Match.getOne}, 

    { method: 'GET', path: '/matchs/{matchId}/bets', config: Match.getBet},
  
    { method: 'PUT', path: '/matchs/{matchId}', config: Match.update}, 

    { method: 'DELETE', path: '/matchs/{matchId}', config: Match.remove}, 

  ]);