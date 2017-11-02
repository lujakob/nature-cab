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
            <div className="fl w-20"><Link to={`/ride/${ride.id}`}>{ride.start}</Link></div>
            <div className="fl w-20"><Link to={`/ride/${ride.id}`}>{ride.end}</Link></div>
            <div className="fl w-20">{moment(new Date(ride.startDate)).format('D.M.Y')}</div>
            <div className="fl w-20">{moment(new Date(ride.startDate)).format('kk:mm')} Uhr</div>
            <div className="fl w-20">{ride.activity}</div>
          </div>
        ))
        }
      </div>
    )
  }
};

export default RideList