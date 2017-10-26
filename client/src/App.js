import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import Header from './components/Header'
import RideListWithData from './components/RideListWithData'
import MyRidesWithData from './components/MyRidesWithData'
import CreateRide from './components/CreateRide'
import Login from './components/Login'

import {GC_AUTH_TOKEN} from './constants'
import './styles/App.css'


const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = localStorage.getItem(GC_AUTH_TOKEN)
    req.options.headers.authorization = token ? `Bearer ${token}` : null
    next()
  }
}])
const client = new ApolloClient({networkInterface});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className='center w85'>
          <Header />
          <div className='ph3 pv1 background-gray'>
            <Switch>
              <Route exact path='/' render={() => <Redirect to='/ridelist'/> }/>
              <Route exact path='/login' component={Login}/>
              <Route exact path='/ridelist' component={RideListWithData}/>
              <Route exact path='/myrides' component={MyRidesWithData}/>
              <Route exact path='/create' component={CreateRide}/>
            </Switch>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App
