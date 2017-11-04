import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/de'

class RideList extends Component {

  render () {
    return (
      <div className="ride-list">
        {this.props.rides && this.props.rides.map((ride, index) => (
          <div className="ride-item cf" key={index} index={index}>
            <Link to={`/ride/${ride.id}`}></Link>
            <div className="ride-item-start-date">
              {moment(new Date(ride.startDate)).format('ddd D.MMM')} - {moment(new Date(ride.startDate)).format('kk:mm')} Uhr
            </div>

            <div className="ride-item-start-end">
              {ride.start} - {ride.end}
            </div>
            <div className="ride-item-activity">
              {ride.activity}
            </div>
          </div>
        ))
        }
      </div>
    )
  }
};

export default RideList