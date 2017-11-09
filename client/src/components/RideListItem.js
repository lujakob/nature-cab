import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/de'
import RideUser from './RideUser'
import {getActivityFromId} from '../utils/misc'

class RideListItem extends Component {

  render () {
    const ride = this.props.ride
    return (
      <div className="ride-list-item cf">
        <Link to={`/ride/${ride.id}`} className="cf">
          <div className="ride-list-item__user">
            <RideUser user={ride.user} />
          </div>
          <div className="ride-list-item__infos cf">
            <div className="ride-list-item__left-col">
              <div className="ride-list-item__start-date">
                {moment(new Date(ride.startDate)).format('ddd D.MMM')} - {moment(new Date(ride.startDate)).format('kk:mm')} Uhr
              </div>
              <div className="ride-list-item__start-end">
                {ride.start} - {ride.end}
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
};

export default RideListItem