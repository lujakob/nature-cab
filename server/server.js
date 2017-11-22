import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import bearerToken from 'express-bearer-token'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


import {schema} from './src/schema'
import USER from './src/models/user'

import {JWT_SECRET} from './constants'

export const users = [
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

  // find user in DB and check password
  USER.findOne({email: email}, (err, user) => {

    if (err) {
      console.log('Login failed, user not found', err)
    } else {

      if( !user ){
        res.status(401).json({message:'EMAIL_NOT_FOUND'});
      } else {

        bcrypt.compare(req.body.password, user.password).then(authenticated => {

          if(authenticated) {
            let payload = {_id: user._id};
            let token = jwt.sign(payload, JWT_SECRET);
            res.json({message: 'ok', token: token, id: user._id});
          } else {
            res.status(401).json({message:'UNAUTHORIZED'});
          }
        }).catch(err => console.log(err))
      }
    }
  })
})

// check valid token and add user if available
const authenticate = (req, res, next) => {
  if (req.token) {
    jwt.verify(req.token, JWT_SECRET, (err, decoded) => {

      if (err) {
        console.log(err)
        next()
      } else if (decoded && decoded._id) {
        // find user in DB and check password
        USER.findById(decoded._id, '_id', (err, user) => {
          if (err) {
            console.log('User not found', err)
          } else if (!user) {
            console.log('User not found')
            // remove token if user not found (which means token is invalid)
            req.token = null
            req.user = null
          } else {
            req.user = user._id
          }
          next()
        })
      }
    })
  } else {
    next()
  }
}

// graphql resource - add request token and user to context
server.post('/graphql', authenticate, graphqlExpress(({token, user}) => ({
  schema,
  context: {
    token,
    user
  }
})))

// graphiql
server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

mongoose.connect('mongodb://localhost:27017/naturecab', {useMongoClient: true})
const db = mongoose.connection;
db.on('error', ()=> {console.log( '---FAILED to connect to mongoose')})
db.once('open', () => {
  console.log('+++Connected to mongoose')
})


// run server
server.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}`)
)