import {FACEBOOK_ACCESS_TOKEN, JWT_SECRET} from '../config'
import USER from './models/user'
import {getJWT} from './utils'
import bcrypt from 'bcrypt'
import request from 'request'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'

import {renderToStringWithData, ApolloProvider} from 'react-apollo'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'
import LayoutRoutes from '../frontend/components/Layout/LayoutRoutes'
import Html from '../frontend/pages/Html'
import {getHttpLink} from '../links'
import React from 'react'
import {StaticRouter} from 'react-router'
import ReactDOM from 'react-dom/server'
import {PORT} from '../config'

const API_URL = 'http://localhost:' + PORT

export const serverSideRenderingMiddleware = (req, res) => {

  const client = new ApolloClient({
    ssrMode: true,
    link: getHttpLink(API_URL),
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
}


export const bodyparserMiddlewares = [
  bodyParser.urlencoded({extended: true}),
  bodyParser.json()
]

// check valid token and add user if available
export const authenticateMiddleware = (req, res, next) => {
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

export const loginMiddleware = (req, res) => {
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
}