import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Header from './Header'
import RideList from './RideList'

import '../styles/App.css'
import Login from './Login'

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App
