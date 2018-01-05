const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fs = require('fs')

module.exports = function (fastify, opts, next) {
  const registerSchema = {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } }
          }
        },
        409: {
          type: 'object',
          properties: {
            errorCode: { type: 'string' },
            errorMessage: { type: 'string' }
          }
        }
      }
    }
  }

  fastify.post('/users/register', registerSchema, async (req, reply) => {
    const User = fastify.mongo.db.model('User')

    User.findOne({ username: req.body.username }, async (error, user) => {
      if (error) throw error

      if (user) {
        return reply.code(409).send({ errorCode: 409, errorMessage: 'Username already exists' })
      }

      const password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
      const newUser = new User(Object.assign(req.body, { password, roles: ['ROLE_USER'] }))
      const { _id, username, email, roles } = await newUser.save()

      reply.send({ _id, username, email, roles })
    })
  })

  const loginSchema = {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' }
          }
        },
        401: {
          type: 'object',
          properties: {
            errorCode: { type: 'string' },
            errorMessage: { type: 'string' }
          }
        }
      }
    }
  }

  fastify.post('/users/login', loginSchema, async (req, reply) => {
    const User = fastify.mongo.db.model('User')

    User.findOne({ username: req.body.username }, async (error, user) => {
      if (error) throw error

      if (!user) {
        return reply.code(409).send({ errorCode: 409, errorMessage: 'Login failed' })
      }

      if (false === await bcrypt.compare(req.body.password, user.password)) {
        return reply.code(409).send({ errorCode: 409, errorMessage: 'Login failed' })
      }

      const{ _id, username, email, roles } = user

      jwt.sign({ _id, username, email, roles }, { key: fs.readFileSync('./config/jwt/private.pem'), passphrase: process.env.JWT_PASSPHRASE }, { algorithm: 'RS256' }, (error, token) => {
        if (error) throw error

        reply.send({ token })
      })
    })
  })

  next()
}