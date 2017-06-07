'use strict';

const Bet = require('../controller/bet');




module.exports = ([

    { method: 'GET', path: '/bets', config: Bet.getAll},
    
    { method: 'POST', path: '/bets', config:  Bet.create }, 

    { method: 'GET', path: '/bets/{betId}', config: Bet.getOne}, 
  
    { method: 'PUT', path: '/bets/{betId}', config: Bet.update}, 

    { method: 'DELETE', path: '/bets/{betId}', config: Bet.remove}, 

  ]);