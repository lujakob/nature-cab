import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import bearerToken from 'express-bearer-token'

import { schema } from './src/schema'

const jwtSecret = 'tasmanianDevil'

const users = [
  {id:1, email: 'test', password: 'test', name: 'Lukas'},
  {id:2, email: 'test2', password: 'test', name: 'Tom'}
]

const PORT = 4000
const server = express()

// add token to request
server.use(bearerToken())

// log requests to console
server.use(morgan('dev'))

server.use('*', cors({ origin: 'http://localhost:3000' }))
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

// login route - returns jwt token for valid user
server.post('/login', function(req, res) {
  if(!req.body.email || !req.body.password){
    throw Error('email and password not in post request')
  }

  let {email, password} = req.body
  // usually this would be a database call:
  let user = users.find(user => user.email === email);
  if( ! user ){
    res.status(401).json({message:"no such user found"});
  }

  if(user.password === req.body.password) {
    var payload = {id: user.id};
    var token = jwt.sign(payload, jwtSecret);
    res.json({message: "ok", token: token, id: user.id});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
})

// check valid token and add user if available
const authenticate = (req, res, next) => {
  console.log('token', req.token)
  if (req.token) {
    jwt.verify(req.token, jwtSecret, (err, decoded) => {
      if (err) {
        console.log(err)
      } else if (decoded && decoded.id) {
        req.user = users.find(user => user.id === decoded.id)
      }
    })
  }

  next()
}

// graphql resource - add request token to context
server.post('/graphql', authenticate, graphqlExpress(request => ({
  schema,
  context: {
    token: request.token,
    user: request.user
  }
})))

// graphiql
server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

// run server
server.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}`)
)