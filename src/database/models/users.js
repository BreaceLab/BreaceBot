const { Schema, model } = require('mongoose')

module.exports = model('users', new Schema({
  _id: { type: String, required: true },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  xp: { type: Number, default: 0 }
}, { timestamps: true }))
