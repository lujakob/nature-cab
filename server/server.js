import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import bearerToken from 'express-bearer-token'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import request from 'request'

import {schema} from './src/schema'
import USER from './src/models/user'

import {JWT_SECRET} from './constants'

const PORT = 4000
const server = express()

const accessToken = '1953108001624740|3-YCCMcfRiGG2F-pc4PUxh9FsRA'

// add token to request
server.use(bearerToken())

// log requests to console
server.use(morgan('dev'))

server.use('*', cors({ origin: 'http://localhost:3000' }))
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

// login route - returns jwt token for valid user
server.post('/login', function(req, res) {
  let {email, password, accessToken} = req.body

  if(!(email && password || accessToken)){
    console.log("No credentials in response body found.")
    res.status(401).json({message:'UNAUTHORIZED'})
  }

  // on the client side FB API this is called "accessToken", requesting '/debug_token' verification it's called inputToken
  const inputToken = accessToken

  if (email && password) {
    // find user in DB and check password
    USER.findOne({email: email}, (err, user) => {

      if (err) {
        console.log('Login failed, user not found', err)
      } else {

        if( !user ){
          res.status(401).json({message:'EMAIL_NOT_FOUND'});
        } else {

          bcrypt.compare(password, user.password).then(authenticated => {

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
  } else if(inputToken) {
    const url = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`
    request(url, { json: true }, (err, res, body) => {
      if (err) {
        console.log('Facebook /debug_token failed', err)
      }

      if (body && body.data && body.data.is_valid) {
        // get user data and store in db
        // USER.findOrCreate({ email: 'Mike' }, { slug: 'mike' }, (err, result) => {
        //   // my new or existing model is loaded as result
        // })

      }

      console.log(body)
    })
  }

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