import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import morgan from 'morgan'
import bearerToken from 'express-bearer-token'

import { schema } from './src/schema'

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
jwtOptions.secretOrKey = 'tasmanianDevil'

const users = [
  {id:1, email: 'test', password: 'test', name: 'Lukas'},
  {id:2, email: 'test2', password: 'test', name: 'Tom'}
]

let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  let user = users.find(user => user.id === jwt_payload.id);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

const PORT = 4000
const server = express()
server.use(bearerToken())

server.use(morgan('dev'))

server.use(passport.initialize())

server.use('*', cors({ origin: 'http://localhost:3000' }))
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

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
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    var payload = {id: user.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token, id: user.id});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
})

server.get('/secret', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({message: 'Success! You can not see this without a token'});
})

server.use((req, res, next) => {
  console.log('token', req.token)
  next()
})

// add request token to context
server.post('/graphql', graphqlExpress(request => ({
  schema,
  context: { token: request.token }
})))


server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))


server.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}`)
)