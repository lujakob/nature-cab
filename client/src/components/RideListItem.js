import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/de'

class RideListItem extends Component {

  render () {
    return (
      <div className="ride-list-item cf">
        <Link to={`/ride/${this.props.ride.id}`}>
          <div className="ride-list-item__start-date">
            {moment(new Date(this.props.ride.startDate)).format('ddd D.MMM')} - {moment(new Date(this.props.ride.startDate)).format('kk:mm')} Uhr
          </div>

          <div className="ride-list-item__start-end">
            {this.props.ride.start} - {this.props.ride.end}
          </div>

          <div className="ride-list-item__activity">
            {this.props.ride.activity}
          </div>

          <div className="ride-list-item__seats">
            Freie Plätze: {this.props.ride.seats}
          </div>

          <div className="ride-list-item__price">
            Preis: {this.props.ride.price} &euro;
          </div>

        </Link>
      </div>
    )
  }
};

export default RideListItem