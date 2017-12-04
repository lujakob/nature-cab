import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { onError } from 'apollo-link-error'
import { ApolloLink, from } from 'apollo-link';

import UeberNatureCabPage from './pages/UeberNatureCab'
import RidesPage from './pages/RidesPage'
import CreateRidePage from './pages/CreateRidePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserPage from './pages/user/UserPage'
import NoMatch404Page from './pages/NoMatch404Page'
import HomePage from './pages/HomePage'
import {LayoutBase} from './components/Layout/LayoutBase'

import {GC_AUTH_TOKEN, GC_USER_ID} from './constants'
import './styles/css/App.css'

const httpLink = createHttpLink({uri: 'http://localhost:4000/graphql'})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(() => {
    const token = localStorage.getItem(GC_AUTH_TOKEN)
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
        <Switch>
          <Route exact path='/login' component={LoginPage}/>
          <Route exact path='/register' component={RegisterPage}/>
          <LayoutBase client={client}>
            <Switch>
              <Route exact path='/' component={HomePage}/>
              <Route path='/rides' component={RidesPage}/>
              <ProtectedRoute exact path='/create' component={CreateRidePage}/>
              <ProtectedRoute path='/user' component={UserPage}/>
              <ProtectedRoute path='/ueber-naturecab' component={UeberNatureCabPage}/>
              <Route exact path="/404" component={NoMatch404Page}/>
              <Redirect to="/404"/>
            </Switch>
          </LayoutBase>
        </Switch>
      </ApolloProvider>
    )
  }
}

const ProtectedRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => {
    const token = localStorage.getItem(GC_AUTH_TOKEN)
    return token
      ? <Component {...props}/>
      : <Redirect to={{pathname:'/login'}}/>
  }}/>
)

const logout = () => {
  localStorage.removeItem(GC_USER_ID)
  localStorage.removeItem(GC_AUTH_TOKEN)
}

export default App
