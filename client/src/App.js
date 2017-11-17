import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { setContext } from 'apollo-link-context'

import Header from './components/Header'
import Rides from './components/Ride/Rides'
import CreateRide from './components/CreateRide'
import Login from './components/Login'
import Register from './components/Register'
import UserPage from './components/User/UserPage'
import {NoMatch404} from './components/NoMatch404'

import {GC_AUTH_TOKEN} from './constants'
import './styles/App.css'

const httpLink = createHttpLink({uri: 'http://localhost:4000/graphql'})
const token = localStorage.getItem(GC_AUTH_TOKEN)

const middlewareLink = setContext(() => ({
  headers: {
    authorization: token ? `Bearer ${token}` : null
  }
}))

const link = middlewareLink.concat(httpLink)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className='center w85'>
          <Header resetStore={client.resetStore}/>
          <div className='ph3 background-gray'>
            <Switch>
              <Route exact path='/' render={() => <Redirect to='/rides'/> }/>
              <Route exact path='/login' component={Login}/>
              <Route path='/rides' component={Rides}/>
              <ProtectedRoute exact path='/create' component={CreateRide}/>
              <Route exact path='/register' component={Register}/>
              <ProtectedRoute path='/user' component={UserPage}/>
              <Route exact path="/404" component={NoMatch404}/>
              <Redirect to="/404"/>
            </Switch>
          </div>
        </div>
      </ApolloProvider>
    )
  }
}

const ProtectedRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => {
    const token = localStorage.getItem(GC_AUTH_TOKEN)
    if (token) {
      return <Component {...props}/>
    } else {
      return <Redirect to={{pathname:'/login'}}/>
    }
  }}/>
)

export default App
