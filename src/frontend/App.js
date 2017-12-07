import React, { Component } from 'react'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { onError } from 'apollo-link-error'
import { ApolloLink, from } from 'apollo-link'

import LayoutRoutes from './components/Layout/LayoutRoutes'
import LocalStorage from './utils/localStorage'

import {GC_AUTH_TOKEN, GC_USER_ID} from './constants'
import {BASE_URL, isProduction, DEFAULT_PORT} from '../config'

import './styles/scss/index.scss'

console.log("isProduction", isProduction);

const PORT =
  process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : DEFAULT_PORT

const API_URL = isProduction
  ? BASE_URL
  : 'http://localhost:' + PORT

const httpLink = createHttpLink({uri: API_URL + '/graphql'})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(() => {
    const token = LocalStorage.getItem(GC_AUTH_TOKEN)
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : null,
        accept: 'application/json'
      }
    }
  })

  return forward(operation);
})

const logoutLink = onError(({ graphQLErrors, networkError, response }) => {
  if (graphQLErrors && graphQLErrors[0]['message'] === 'UNAUTHORIZED') {
    logout()
    // ignore errors to prevent: Uncaught (in promise) Error: GraphQL error: UNAUTHORIZED
    // https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-error
    response.errors = null;
  }
})

const client = new ApolloClient({
  link: from([authMiddleware, logoutLink, httpLink]),
  cache: new InMemoryCache()
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <LayoutRoutes client={client}/>
      </ApolloProvider>
    )
  }
}


const logout = () => {
  LocalStorage.removeItem(GC_USER_ID)
  LocalStorage.removeItem(GC_AUTH_TOKEN)
}

export default App
