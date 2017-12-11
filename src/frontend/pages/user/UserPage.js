import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import UserProfilePage from './UserProfilePage'
import UserRidesPage from './UserRidesPage'
import UserNav from '../../components/User/UserNav'
import CreateRidePage from '../CreateRidePage'
import RideDetail from '../../components/Ride/RideDetail'

class UserPage extends Component {

  render() {

    return (
      <div className='user-page'>
        <UserNav/>
        <Switch>
          <Redirect exact from="/user" to="/user/profile"/>
          <Route exact path="/user/profile" component={UserProfilePage}/>
          <Route exact path="/user/rides" component={UserRidesPage}/>
          <Route path={'/user/rides/:id/edit'} component={CreateRidePage}/>
          <Route path={'/user/rides/:id'} component={RideDetail}/>
          <Redirect to="/404"/>
        </Switch>
      </div>
    )
  }
}

export default UserPage