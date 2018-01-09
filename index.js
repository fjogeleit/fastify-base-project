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
  .register(require('./routes/userRoutes'), { prefix: '/users' })
  .register(require('./routes/indexRoutes'))

fastify.listen(process.env.SERVER_PORT || 3000, function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})