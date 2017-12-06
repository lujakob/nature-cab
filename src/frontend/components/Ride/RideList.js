import React, {Component} from 'react'
import RideListItem from './RideListItem'

class RideList extends Component {

  render () {
    const {detailLinkPrefix} = this.props

    return (
      <div className="ride-list">
        {this.props.rides && this.props.rides.map((ride, index) => (
          <RideListItem ride={ride} key={index} detailLinkPrefix={detailLinkPrefix}/>
        ))
        }
      </div>
    )
  }
};

export default RideList