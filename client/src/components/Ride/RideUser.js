import React, {Component} from 'react'
import {getAgeFromYearOfBirth, truncateName} from '../../utils/misc'
import {TRANSPORTATION_TYPES} from '../../constants'


class RideUser extends Component {

  render () {

    const {user, showVehicle, showDescription} = this.props

    return (
      <div className="ride-user">
        <div className="ride-user__top cf">
          <div className="ride-user__user-image">
            <img src="/no-headshot.jpg" alt="Benutzer Bild"/>
          </div>
          <div className="ride-user__user-info">
            <div className="ride-user__user-name">{user.firstname} {truncateName(user.lastname)}</div>
            <div className="ride-user__year-of-birth">{getAgeFromYearOfBirth(user.yearOfBirth)} Jahre</div>
          </div>
        </div>
        {showVehicle &&
        <div className="ride-user__car">
          <h4>Transportmittel</h4>
          {this._getVehicle(user)}
        </div>
        }
        {showDescription && user.description &&
        <div className="ride-user__description">
          <h4>Infos zum Fahrer</h4>
          {user.description}
        </div>
        }

      </div>
    )
  }

  _getVehicle(user) {
    if (user.vehicle === 'TRAIN') {
      let el = TRANSPORTATION_TYPES.find((el) => el['value'] === user.vehicle)
      return !!el['title'] ? el['title'] : ''
    } else {
      return user.carType + (user.carColor ? ', ' + user.carColor : '')
    }
  }
};

export default RideUser