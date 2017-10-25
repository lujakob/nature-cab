import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import morgan from 'morgan'

import { schema } from './src/schema'

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
jwtOptions.secretOrKey = 'tasmanianDevil'

const users = [
  {id:1, email: 'test', password: 'test'}
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
});

server.get('/secret', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({message: 'Success! You can not see this without a token'});
});

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));


server.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}`)
)

// function serialize(req, res, next) {
//     console.log(req);
//   req.user = {
//     id: users[0].id
//   }
//
//   next()
// }
//
// const jwt = require('jsonwebtoken');
//
// function generateToken(req, res, next) {
//   req.token = jwt.sign({
//     id: req.user.id,
//   }, 'server secret', {
//     expiresInMinutes: 120
//   })
//
//   next()
// }
//
// function respond(req, res) {
//   res.status(200).json({
//     user: req.user,
//     token: req.token
//   })
// }