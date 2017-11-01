import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/de'

class RideList extends Component {

  render () {
    return (
      <div className="ride-list">
        {this.props.rides && this.props.rides.map((ride, index) => (
          <div className="ride-item" key={index} index={index}>
            <div className="fl w-20">{ride.start}</div>
            <div className="fl w-20">{ride.end}</div>
            <div className="fl w-20">{moment(new Date(ride.startDate)).format('D.M.Y')}</div>
            <div className="fl w-20">{ride.activity}</div>
            <div className="fl w-20"><Link to={`/ride/${ride.id}`}>Detail</Link></div>
          </div>
        ))
        }
      </div>
    )
  }
};

export default RideList