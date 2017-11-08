import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/de'
import {getAgeFromYearOfBirth} from '../utils'

class RideListItem extends Component {

  render () {
    return (
      <div className="ride-list-item cf">
        <Link to={`/ride/${this.props.ride.id}`} className="cf">
          <div className="ride-list-item__user">
            <div className="ride-list-item__user-image">
              <img src="no-headshot.jpg"/>
            </div>
            <div className="ride-list-item__user-name">{this.props.ride.user.firstname} {this.props.ride.user.lastname}</div>
            <div className="ride-list-item__user-age">{getAgeFromYearOfBirth(this.props.ride.user.yearOfBirth)}</div>
          </div>
          <div className="ride-list-item__infos cf">
            <div className="ride-list-item__left-col">
              <div className="ride-list-item__start-date">
                {moment(new Date(this.props.ride.startDate)).format('ddd D.MMM')} - {moment(new Date(this.props.ride.startDate)).format('kk:mm')} Uhr
              </div>

              <div className="ride-list-item__start-end">
                {this.props.ride.start} - {this.props.ride.end}
              </div>

              <div className="ride-list-item__activity">
                {this.props.ride.activity}
              </div>
            </div>

            <div className="ride-list-item__right-col">
              <div className="ride-list-item__price">
                <div className="price">{this.props.ride.price} &euro;</div>
                <div className="price-title">pro Mitfahrer</div>
              </div>

              <div className="ride-list-item__seats">
                {this.props.ride.seats} Plätze frei
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }
};

export default RideListItem