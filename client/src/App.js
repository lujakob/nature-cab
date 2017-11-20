import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { onError } from 'apollo-link-error'
import { ApolloLink, from } from 'apollo-link';

import Header from './components/Header'
import Rides from './components/Ride/Rides'
import CreateRide from './components/Ride/CreateRide'
import Login from './components/Login'
import Register from './components/Register'
import UserPage from './components/User/UserPage'
import {NoMatch404} from './components/NoMatch404'
import Home from './components/Home/Home'

import {GC_AUTH_TOKEN, GC_USER_ID} from './constants'
import './styles/App.css'

const httpLink = createHttpLink({uri: 'http://localhost:4000/graphql'})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(() => {
    const token = localStorage.getItem(GC_AUTH_TOKEN)
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : null
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
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
          <Layout>
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route path='/rides' component={Rides}/>
              <ProtectedRoute exact path='/create' component={CreateRide}/>
              <ProtectedRoute path='/user' component={UserPage}/>
              <Route exact path="/404" component={NoMatch404}/>
              <Redirect to="/404"/>
            </Switch>
          </Layout>
        </Switch>
      </ApolloProvider>
    )
  }
}

const Layout = ({children}) => {
  return (
    <div className='center w85'>
      <Header resetStore={client.resetStore}/>
      <div className='ph3 background-gray'>
        {children}
      </div>
    </div>
  )
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
