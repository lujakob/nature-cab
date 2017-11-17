import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import RideUser from './RideUser'
import {getActivityFromId, getFormattedDate} from '../../utils/misc'

class RideListItem extends Component {

  render () {
    const ride = this.props.ride
    return (
      <div className="ride-list-item cf">
        <Link to={`/rides/${ride._id}`} className="cf">
          <div className="ride-list-item__user">
            <RideUser user={ride.user} />
          </div>
          <div className="ride-list-item__infos cf">
            <div className="ride-list-item__left-col">
              <div className="ride-list-item__start-date">
                {getFormattedDate(ride.startDate)}
              </div>
              <div className="ride-list-item__start-end">
                {ride.startCity} - {ride.endCity}
              </div>
              {getActivityFromId(ride.activity) &&
              <div className="ride-list-item__activity">
                {getActivityFromId(ride.activity)}
              </div>
              }
            </div>

            <div className="ride-list-item__right-col">
              <div className="ride-list-item__price">
                <div className="price">{ride.price} &euro;</div>
                <div className="price-title">pro Mitfahrer</div>
              </div>
              <div className="ride-list-item__seats">
                {ride.seats} Plätze frei
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default RideListItem