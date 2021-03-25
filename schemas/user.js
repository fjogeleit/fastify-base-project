const mongoose = require('mongoose')

module.exports = function (fastify, opts, next) {
  const Schema = mongoose.Schema

  const User = new Schema({
    username: String,
    email: String,
    roles: [String],
    password: String,
    created: { type: Date, default: Date.now }
  })

  fastify.mongo.db.model('User', User)

  next()
}
