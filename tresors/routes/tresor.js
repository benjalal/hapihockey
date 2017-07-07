'use strict';

const Tresor = require('../controller/tresor');




module.exports = ([

    { method: 'GET', path: '/tresors', config: Tresor.getAll},
    
    //{ method: 'POST', path: '/bets', config:  Bet.create }, 

    //{ method: 'GET', path: '/tresors/{tresorID}', config: Tresor.getOne}, 
  
    //{ method: 'PUT', path: '/bets/{bet_id}', config: Bet.update}, 

    //{ method: 'DELETE', path: '/bets/{bet_id}', config: Bet.remove}, 

  ]);