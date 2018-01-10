module.exports = function (fastify, opts, next) {
  const indexSchema = {
    schema: {
      description: 'Unauthenticate access',
      tags: ['Index'],
      summary: 'Hello World',
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

  const authSchema = {
    schema: {
      description: 'Only authenticate access',
      tags: ['Index'],
      summary: 'Hello Username',
      security: [{ "api_key": [] }],
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
  next()
}