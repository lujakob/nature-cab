import express from 'express'
import path from 'path'
import proxy from 'http-proxy-middleware'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'

import morgan from 'morgan'
import bearerToken from 'express-bearer-token'
import mongoose from 'mongoose'

import {loginMiddleware, authenticateMiddleware, bodyparserMiddlewares, serverSideRenderingMiddleware} from './backend/middlewares'

import {schema} from './backend/schema'

import {MONGO_CONFIG_LIVE, isProduction, PORT} from './config'

let {HOST, USERNAME, DATABASE_NAME, PASSWORD, PARAMS} = MONGO_CONFIG_LIVE
PASSWORD = encodeURIComponent(PASSWORD)

const mongoUri = isProduction
  ? `mongodb://${USERNAME}:${PASSWORD}@${HOST}/${DATABASE_NAME}?${PARAMS}`
  : 'mongodb://localhost:27017/naturecab'

mongoose.Promise = global.Promise
mongoose.connect(mongoUri, {useMongoClient: true})
const db = mongoose.connection

db.on('error', (e) => {
  console.log( '---FAILED to connect to mongoose', e)
})

db.once('open', () => {
  console.log('+++Connected to mongoose')

  const server = express()

  if (isProduction) {
    // In production we want to serve our JS from a file on the filesystem.
    server.use(
      '/static',
      express.static(path.join(process.cwd(), 'build/frontend'))
    )
  } else {
    // Otherwise we want to proxy the webpack development server that serves from memory
    server.use(
      '/static',
      proxy({ target: 'http://localhost:3020'})
    )
  }

// add token to request
  server.use(bearerToken())

  // log requests to console
  if (!isProduction) {
    server.use(morgan('dev'))
  }

  // login route - returns jwt token for valid user
  server.post('/login', ...bodyparserMiddlewares, loginMiddleware)


  // graphql resource - add request token and user to context
  server.post('/graphql', ...bodyparserMiddlewares, authenticateMiddleware, graphqlExpress(({token, user}) => ({
    schema,
    context: {
      token,
      user
    }
  })))

  // graphiql
  server.use('/graphiql', ...bodyparserMiddlewares, graphiqlExpress({
    endpointURL: '/graphql'
  }))

  // server side rendering
  server.use(serverSideRenderingMiddleware)

  // run server
  server.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
})

// When the connection is disconnected
db.on('disconnected', function () {
  console.log('Mongoose default connection to DB disconnected');
})

// const gracefulExit = () => {
//   db.close(() => {
//     console.log('Mongoose default connection with DB is disconnected through app termination');
//     process.exit(0);
//   })
// }
//
// // If the Node process ends, close the Mongoose connection
// process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);