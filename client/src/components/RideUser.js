import React, {Component} from 'react'
import {getAgeFromYearOfBirth, truncateName} from '../utils/misc'

class RideUser extends Component {

  render () {
    return (
      <div className="ride-user">
        <div className="cf">
          <div className="ride-user__user-image">
            <img src="/no-headshot.jpg" alt="Benutzer Bild"/>
          </div>
          <div className="ride-user__user-info">
            <div className="ride-user__user-name">{this.props.user.firstname} {truncateName(this.props.user.lastname)}</div>
            <div className="ride-user__year-of-birth">{getAgeFromYearOfBirth(this.props.user.yearOfBirth)} Jahre</div>
          </div>
        </div>
        {this.props.showCar &&
        <div className="ride-user__car">
          <h4>Auto</h4>
          {this.props.user.car}{this.props.user.carColor ? ', ' + this.props.user.carColor : ''}
        </div>
        }
      </div>
    )
  }
};

export default RideUser