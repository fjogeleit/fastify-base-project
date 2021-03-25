const jwt = require('jsonwebtoken')
const fastifyPlugin = require('fastify-plugin')
const fs = require('fs')

const jwtAuth = function (fastify, opts, next) {
  fastify.decorate('jwtAuth', function (request, reply, done) {
    if (!request.req.headers.authorization) {
      return reply.code(401).send({ message: ' Unauthorized' })
    }

    jwt.verify(request.req.headers.authorization.replace('Bearer', '').trim(), fs.readFileSync('./config/jwt/public.pem'), (err, decoded) => {
      if (err || !decoded.username) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }

      fastify.mongo.db.model('User').findOne({ username: decoded.username }, (error, user) => {
        if (error) {
          return reply.code(500).send({ message: error.message })
        }

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

module.exports = fastifyPlugin(jwtAuth, '>=0.13.1')
