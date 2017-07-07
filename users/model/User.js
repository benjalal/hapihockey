'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tresor = require('../../tresors/model/Tresor');

const userModel = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
  //bets: [{type: Schema.Types.ObjectId, ref: 'Bet', unique:true}],
  tresors: [{type: Schema.Types.ObjectId, ref: 'Tresor', unique:true}],
  //points: {type: Number, min:0, defaultsTo: 0}
});

module.exports = mongoose.model('User', userModel);