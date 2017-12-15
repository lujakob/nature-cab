import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'
import PropTypes from 'prop-types'

class RideListWithData extends Component {

  render() {

    const {loading, error, rides} = this.props.data
    const showLatestTitle = this.props.limit && this.props.limit > 0

    if (loading) {
      return <div className="ride-list">Loading...</div>
    }
    if (error) {
      return <div className="ride-list">{error.message}</div>
    }

    return (
      <div className="ride-list">
        {rides && rides.total === 0 &&
          <p className="error-message">Sorry, für diesen Filter haben wir keine Einträge gefunden.</p>
        }
        {rides && rides.total > 0 &&
          <div>
            {showLatestTitle ? (
              <p className="latest-title">Neueste Fahrten</p>
            ) : (
              <p className="total-count-title">{rides.total} Ergebnisse gefunden</p>
            )}

            <RideList rides={rides.rides} detailLinkPrefix="/ride/"/>
          </div>
        }
      </div>
    )
  }
}

export const rideListQuery = gql`
  query RideListQuery($start: String, $end: String, $activity: String, $limit: Int) {
    rides(start: $start, end: $end, activity: $activity, limit: $limit) {
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
        description
        user {
          firstname
          lastname
          yearOfBirth
          picture
        }
      }
    }
  }
`

RideListWithData.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  activity: PropTypes.string,
  limit: PropTypes.number
}
const withData = graphql(rideListQuery, {
  options: ({start, end, activity, limit}) => ({
    variables: {start, end, activity, limit}
  })
})

export default withData(RideListWithData)