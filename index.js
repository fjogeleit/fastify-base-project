require('dotenv').config()

const fastify = require('fastify')()
const port = process.env.SERVER_PORT || 3000

fastify
  .register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Fastify Basic Project',
        description: 'API Overview',
        version: '0.1.0'
      },
      host: `localhost:${port}`,
      tags: [
        { name: 'User', description: 'User related end-points' }
      ],
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    },
    exposeRoute: true
  })
  .register(require('fastify-helmet'))
  .register(require('fastify-mongoose'), {
    uri: process.env.MONGODB_URI
  }, err => {
    if (err) throw err
  })
  .register(require('./schemas/user'))
  .register(require('fastify-auth'))
  .register(require('./auth/jwt-auth'))
  .register(require('./routes/userRoutes'), { prefix: '/users' })
  .register(require('./routes/indexRoutes'))

fastify.listen(port, function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
