import React, {Component} from 'react'

class RideList extends Component {

  render () {
    return (
      <div className="ride-list">
        {this.props.rides && this.props.rides.map((ride, index) => (
          <div className="ride-item" key={index} index={index}>
            <div className="fl w-20">{ride.start}</div>
            <div className="fl w-20">{ride.end}</div>
            <div className="fl w-20">{ride.seats}</div>
            <div className="fl w-20">{ride.activity}</div>
            <div className="fl w-20">{ride.name}</div>
          </div>
        ))
        }
      </div>
    )
  }
};

export default RideList