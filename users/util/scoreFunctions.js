// betWinnerIsMatchWinner
//
// @description :: return true if has bet on the good winner (or tie)
// @param       :: match (required): the match instance
//                 bet (require): the bet concerned
function betWinnerIsMatchWinner(scoreDom, scoreExt, betDom, betExt) {
  var DomWins = scoreDom > scoreExt;
  var tie = scoreDom === scoreExt;
  
  var betOnDom = betDom > betExt;
  var betTie = betDom === betExt;

  return ((DomWins && betOnDom) ||
        (tie && betTie) ||
        (!DomWins && !betOnDom && !tie && !betTie));//if Exterior wins and user bet on exterior and not on tie
}



function goodWinnerandOneScore(scoreDom, scoreExt, betDom, betExt) {
  

  var resultDom = scoreDom- betDom ;
  var resultExt = scoreExt - betExt;

  //console.log(resultDom == 0 || resultExt == 0);

  return (betWinnerIsMatchWinner(scoreDom, scoreExt, betDom, betExt) && (resultDom == 0 || resultExt == 0));

}

//perfectBet
//
// @description :: return true if has bet on the good score for the 2 teams
// @param       :: match (required): the match instance
//                 bet (require): the bet concerned
function perfectBet(scoreDom, scoreExt, betDom, betExt) {
  
  var resultDom = scoreDom - betDom ;
  var resultExt = scoreExt - betExt;


   console.log(resultDom);
   console.log(resultExt);

  return (resultDom == 0 && resultExt == 0);

}
    

// computeBetScore
//
// @description :: Calculate a bet score
//                 
// @param       :: match (required): the match instance
//                 bet (require): the bet concerned
function computeBetScore(scoreDom, scoreExt, betDom, betExt) {
  var score = 0;

  // 1. 
  if(betWinnerIsMatchWinner(scoreDom, scoreExt, betDom, betExt)) {
    score += 2;
  }
  //2
  if(goodWinnerandOneScore(scoreDom, scoreExt, betDom, betExt)){
    score += 2;
  }
  //3
  if(perfectBet(scoreDom, scoreExt, betDom, betExt)){
    score += 2;
  }

  return score;
}


module.exports.computeBetScore = computeBetScore;