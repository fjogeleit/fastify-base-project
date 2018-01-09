module.exports = function (fastify, opts, next) {
  const authSchema = {
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

  fastify.get('/auth', authSchema, async (request, reply) => {
    reply.type('application/json').code(200)

    return { hello: 'hello ' + request.user.username }
  })

  const indexSchema = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' }
          }
        }
      }
    }
  }
  fastify.get('/', indexSchema, async (request, reply) => {
    reply.type('application/json').code(200)

    return { hello: 'hello world' }
  })
  next()
}