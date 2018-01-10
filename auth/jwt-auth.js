const jwt = require('jsonwebtoken')
const fp = require('fastify-plugin')
const fs = require('fs')

const jwtAuth = function (fastify, opts, next) {
  fastify.decorate('jwtAuth', function (request, reply, done) {
    if (!request.req.headers['authorization']) {
      return reply.code(401).send({ message: ' Unauthorized' })
    }

    jwt.verify(request.req.headers['authorization'].replace('Bearer', '').trim(), fs.readFileSync('./config/jwt/public.pem'), (err, decoded) => {
      if (err || !decoded.username) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }

      fastify.mongo.db.model('User').findOne({ username: decoded.username }, (error, user) => {
        if (error) throw error

        if (!user) {
          return reply.code(401).send({ message: 'Unauthorized' })
        }

        request.user = user

        done()
      })
    })
  })

  next()
}

module.exports = fp(jwtAuth, '>=0.13.1')