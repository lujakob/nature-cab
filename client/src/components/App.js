import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import Header from './Header'
import RideList from './RideList'

import '../styles/App.css'
import Login from './Login'

const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });
const client = new ApolloClient({networkInterface});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className='center w85'>
          <Header />
          <div className='ph3 pv1 background-gray'>
            <Switch>
              <Route exact path='/' render={() => <Redirect to='/login'/> }/>
              <Route exact path='/login' component={Login}/>
              <Route exact path='/ridelist' component={RideList}/>
            </Switch>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App
