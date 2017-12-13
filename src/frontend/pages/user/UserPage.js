import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import UserProfilePage from './UserProfilePage'
import UserRidesPage from './UserRidesPage'
import UserNav from '../../components/User/UserNav'
import CreateRidePage from '../CreateRidePage'
import RideDetailPage from '../RideDetailPage'

class UserPage extends Component {

  render() {

    return (
      <div className='user-page'>
        <UserNav/>
        <Switch>
          <Redirect exact from="/user" to="/user/profile"/>
          <Route exact path="/user/profile" component={UserProfilePage}/>
          <Route exact path="/user/rides" component={UserRidesPage}/>
          <Route path={'/user/ride/:id/edit'} component={CreateRidePage}/>
          <Route path={'/user/ride/:id'} component={RideDetailPage}/>
          <Redirect to="/404"/>
        </Switch>
      </div>
    )
  }
}

export default UserPage