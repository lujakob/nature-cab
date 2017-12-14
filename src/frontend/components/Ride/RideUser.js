import React, {Component} from 'react'
import {getAgeFromYearOfBirth, truncateName, getUserMailToHref} from '../../utils/misc'
import noHeadShot from '../../img/no-headshot.jpg'


class RideUser extends Component {

  render () {

    const {user, showVehicle, showDescription} = this.props

    const picture = user.picture || noHeadShot

    return (
      <div className="ride-user">
        <div className="ride-user__top cf">
          <div className="ride-user__user-image">
            <img src={picture} alt="Benutzer Bild"/>
          </div>
          <div className="ride-user__user-info">
            <div className="ride-user__user-name">{user.firstname} {truncateName(user.lastname)}</div>
            <div className="ride-user__year-of-birth">{getAgeFromYearOfBirth(user.yearOfBirth)} Jahre</div>
          </div>
        </div>

        {showVehicle &&
        <div className="ride-user__add-info ride-user__add-info--first">
          <h4>Auto</h4>
          {user.carType + (user.carColor ? ', ' + user.carColor : '')}
        </div>
        }

        {showDescription && user.email &&
        <div className="ride-user__add-info">
          <h4>Email</h4>
          <a href={getUserMailToHref(user.email, user.firstname)}>{user.email}</a>
        </div>
        }

        {showDescription &&
        <div className="ride-user__add-info">
          <h4>Telefon</h4>
          {user.phone ? (
            <a href={'tel:' + user.phone}>{user.phone}</a>
          ) : (
            <span>keine Angabe</span>
          )}
        </div>
        }

        {showDescription && user.description &&
        <div className="ride-user__add-info ride-user__add-info--last">
          <h4>Infos zum Fahrer</h4>
          {user.description}
        </div>
        }

      </div>
    )
  }

}

export default RideUser