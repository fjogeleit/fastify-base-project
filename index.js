require('dotenv').config()

const fastify = require('fastify')()

fastify
  .register(require('fastify-mongoose'), {
    uri: process.env.MONGODB_URI
  }, err => {
    if (err) throw err
  })
  .register(require('./schemas/user'))
  .register(require('fastify-auth'))
  .register(require('./auth/jwt-auth'))
  .register(require('./routes/userRoutes'))
  .after(() => {
    const opts = {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              hello: { type: 'string' }
            }
          }
        }
      },
      beforeHandler: fastify.auth([fastify.jwtAuth])
    }

    fastify.get('/auth', opts, async (request, reply) => {
      reply.type('application/json').code(200)

      return { hello: 'hello ' + request.user.username }
    })

    fastify.get('/', async (request, reply) => {
      reply.type('application/json').code(200)

      return { hello: 'hello world' }
    })
  })

fastify.listen(process.env.SERVER_PORT || 3000, function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})