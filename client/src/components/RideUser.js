import React, {Component} from 'react'
import {getAgeFromYearOfBirth, truncateName} from '../utils/misc'

class RideUser extends Component {

  render () {
    return (
      <div className="ride-user cf">
        <div className="ride-user__user-image">
          <img src="/no-headshot.jpg"/>
        </div>
        <div className="ride-user__user-info">
          <div className="user-name">{this.props.user.firstname} {truncateName(this.props.user.lastname)}</div>
          {getAgeFromYearOfBirth(this.props.user.yearOfBirth)} Jahre
        </div>
      </div>
    )
  }
};

export default RideUser