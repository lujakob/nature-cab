import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'

class RideListWithData extends Component {

  render() {

    const {loading, error, rides} = this.props.data

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }

    return (
      <div className="ride-list">
        {rides && rides.total === 0 &&
          <p className="error-message">Sorry, für diesen Filter haben wir keine Einträge gefunden.</p>
        }
        {rides && rides.total > 0 &&
          <div>
            <p class="total-count">{rides.total} Ergebnisse gefunden</p>
            <RideList rides={rides.rides} detailLinkPrefix="/rides/"/>
          </div>
        }
      </div>
    )
  }

}

export const rideListQuery = gql`
  query RideListQuery($start: String, $end: String, $activity: String) {
    rides(start: $start, end: $end, activity: $activity) {
      total
      rides {
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
  }
`

export default graphql(rideListQuery, {
  options: (props) => ({
    variables: {start: props.start, end: props.end, activity: props.activity}
  })
})(RideListWithData)