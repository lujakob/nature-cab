import express from 'express'
import path from 'path'
import proxy from 'http-proxy-middleware'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import bearerToken from 'express-bearer-token'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import request from 'request'
import { renderToStringWithData, ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { StaticRouter } from 'react-router'
import LayoutRoutes from './frontend/components/Layout/LayoutRoutes'
import Html from './frontend/pages/Html'
import {getHttpLink} from './links'
import React from 'react';
import ReactDOM from 'react-dom/server';

import {schema} from './backend/schema'
import USER from './backend/models/user'

import {JWT_SECRET} from './backend/constants'
import {FACEBOOK_ACCESS_TOKEN} from './backend/config'

const PORT =
  process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 4000

const API_HOST =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:' + PORT
    : 'https://api.githunt.com'



const server = express()

if (process.env.NODE_ENV === 'production') {
  // In production we want to serve our JS from a file on the filesystem.
  server.use(
    '/static',
    Express.static(path.join(process.cwd(), 'build/client'))
  )
} else {
  // Otherwise we want to proxy the webpack development server.
  server.use(
    '/static',
    proxy({ target: 'http://localhost:3020'})
  )
}

// server.use('/static', express.static(path.join(process.cwd(), 'build/server')));


// add token to request
server.use(bearerToken())

// log requests to console
server.use(morgan('dev'))

// @Todo: maybe this is redundant
// server.use('*', cors({ origin: 'http://localhost:3000' }))

// login route - returns jwt token for valid user
server.post('/login', bodyParser.urlencoded({extended: true}), bodyParser.json(), (req, res) => {
  let {email, password, accessToken, user} = req.body

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
          res.status(401).json({message:'EMAIL_NOT_FOUND'})
        } else {

          bcrypt.compare(password, user.password).then(authenticated => {

            if(authenticated) {

              res.json({message: 'OK', token: getJWT(user), id: user._id})
            } else {
              res.status(401).json({message:'UNAUTHORIZED'})
            }
          }).catch(err => console.log(err))
        }
      }
    })
  } else if(inputToken) {
    const url = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${FACEBOOK_ACCESS_TOKEN}`
    request(url, { json: true }, (err, response, body) => {
      if (err) {
        console.log('Facebook request /debug_token failed', err)
      }

      if (body && body.data && user) {
        if (body.data.is_valid === true) {
          // get user data and store in db
          USER.findOrCreate({ email: user.email }, user, (err, result) => {
            if (err) {
              console.log('USER.findOrCreate failed', err)
            }
            res.json({message: 'OK', token: getJWT(result), id: result._id})
          })

        } else {
          res.status(401).json({message: 'UNAUTHORIZED'})

        }

      } else {
        res.status(401).json({message: 'UNAUTHORIZED'})
      }
    })
  }

})

const getJWT = (user) => {
  let payload = {_id: user._id}
  return jwt.sign(payload, JWT_SECRET)
}

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
server.post('/graphql', bodyParser.urlencoded({extended: true}), bodyParser.json(), authenticate, graphqlExpress(({token, user}) => ({
  schema,
  context: {
    token,
    user
  }
})))

// graphiql
// server.use('/graphiql', bodyParser.urlencoded({extended: true}), bodyParser.json(), graphiqlExpress({
//   endpointURL: '/graphql'
// }))

// server side rendering
server.use((req, res) => {

  const client = new ApolloClient({
    ssrMode: true,
    link: getHttpLink(API_HOST),
    cache: new InMemoryCache(),
  })

  const context = {};

  const component = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <LayoutRoutes client={client}/>
      </StaticRouter>
    </ApolloProvider>
  )

  renderToStringWithData(component)
    .then((content) => {

      const initialState = client.cache.extract();
      const html = <Html content={content} state={initialState}/>;

      res.status(200);
      res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
      res.end();
    })
    .catch(e => {
      console.error('RENDERING ERROR:', e)
      res.status(500);
      res.end(
        `An error occurred. \n\n${e.stack}`
      )
    })
})

// @Todo: get DB credentials through env
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