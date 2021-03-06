'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Match = require('../../matchs/model/Match');
const User = require('../../users/model/User');

const betModel = new Schema({
  scoreDom: { type: Number,min:0, required: true },
  scoreExt: { type: Number, min:0, required: true },
  score: { type: Number, min:0, defaultsTo:0 },
  match: { type: Schema.Types.ObjectId, ref: 'Match', notEmpty: true, required: true }, // It's a reference to the Match object
  user: { type: Schema.Types.ObjectId, ref:'User', notEmpty: true, required: true},  // The User who's done the Bet
  vainqueur: { type: String}
});

module.exports = mongoose.model('Bet', betModel);