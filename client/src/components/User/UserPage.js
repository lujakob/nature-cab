import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {UserProfileWithData} from './UserProfile'
import UserRidesWithData from './UserRidesWithData'
import UserNav from './UserNav'
import {CreateRideWithData} from '../Ride/CreateRide'

class UserPage extends Component {

  render() {

    return (
      <div className='user-page'>
        <UserNav/>
        <Switch>
          <Redirect exact from="/user" to="/user/profile"/>
          <Route exact path="/user/profile" component={UserProfileWithData}/>
          <Route exact path="/user/rides" component={UserRidesWithData}/>
          <Route path={'/user/rides/:id'} component={CreateRideWithData}/>
          <Redirect to="/404"/>
        </Switch>
      </div>
    )
  }
}

export default UserPage