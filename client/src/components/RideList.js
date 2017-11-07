import React, {Component} from 'react'
import RideListItem from './RideListItem'

class RideList extends Component {

  render () {
    return (
      <div className="ride-list">
        {this.props.rides && this.props.rides.map((ride, index) => (
          <RideListItem ride={ride}/>
        ))
        }
      </div>
    )
  }
};

export default RideList