import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { setContext } from 'apollo-link-context'

import Header from './components/Header'
import Rides from './components/Rides'
import MyRidesWithData from './components/MyRidesWithData'
import CreateRide from './components/CreateRide'
import Login from './components/Login'
import Register from './components/Register'
import {UserProfileWithData} from './components/UserProfile'

import {GC_AUTH_TOKEN} from './constants'
import './styles/App.css'

const httpLink = createHttpLink({uri: 'http://localhost:4000/graphql'})
const token = localStorage.getItem(GC_AUTH_TOKEN)

const middlewareLink = setContext(() => ({
  headers: {
    authorization: token ? `Bearer ${token}` : null
  }
}));

const link = middlewareLink.concat(httpLink);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className='center w85'>
          <Header />
          <div className='ph3 background-gray'>
            <Switch>
              <Route exact path='/' render={() => <Redirect to='/ridelist'/> }/>
              <Route exact path='/login' component={Login}/>
              <Route path='/rides' component={Rides}/>
              <Route exact path='/myrides' component={MyRidesWithData}/>
              <Route exact path='/create' component={CreateRide}/>
              <Route exact path='/register' component={Register}/>
              <Route exact path='/profile' component={UserProfileWithData}/>
            </Switch>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App
