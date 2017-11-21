import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'

class RideListWithData extends Component {

  render() {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    return (
      <div className="ride-list">
        {this.props.data.rides && this.props.data.rides.length === 0 &&
          <p className="error-message">Sorry, für diesen Filter haben wir keine Einträge gefunden.</p>
        }
        {this.props.data.rides && this.props.data.rides.length > 0 &&
          <RideList rides={this.props.data.rides} detailLinkPrefix="/rides/"/>
        }
      </div>
    )
  }

}

export const rideListQuery = gql`
  query RideListQuery($start: String, $end: String, $activity: String) {
    rides(start: $start, end: $end, activity: $activity) {
      _id
      startLocation
      startCity,
      endLocation
      endCity
      activity
      seats
      price
      startDate
      returnInfo
      user {
        firstname
        lastname
        yearOfBirth
      }
    }
  }
`

export default graphql(rideListQuery, {
  options: (props) => ({
    variables: {start: props.start, end: props.end, activity: props.activity}
  })
})(RideListWithData)