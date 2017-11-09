import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import moment from 'moment'
import 'moment/locale/de'
import RideUser from './RideUser'

class RideDetail extends Component {

  render() {

    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    const ride = this.props.data.ride

    return (
      <div className="ride-detail cf">
        <h3>{ride.start} - {ride.end}</h3>
        <div className="ride-detail__left">
          <div className="ride-detail-info">
            <div className="ride-detail-info__row cf">
              <div className="ride-detail-info__label">Abfahrtsort</div>
              <div className="ride-detail-info__field">{ride.start}</div>
            </div>
            <div className="ride-detail-info__row cf">
              <div className="ride-detail-info__label">Ankunftsort</div>
              <div className="ride-detail-info__field">{ride.end}</div>
            </div>
            <div className="ride-detail-info__row cf">
              <div className="ride-detail-info__label">Datum</div>
              <div className="ride-detail-info__field">
                {moment(new Date(ride.startDate)).format('ddd D.MMM')} - {moment(new Date(ride.startDate)).format('kk:mm')} Uhr
              </div>
            </div>
            <div className="ride-detail-info__row cf">
              <div className="ride-detail-info__label">Preis pro Mitfahrer</div>
              <div className="ride-detail-info__field">{ride.price} &euro;</div>
            </div>
            <div className="ride-detail-info__row cf">
              <div className="ride-detail-info__label">Anzahl der Plätze</div>
              <div className="ride-detail-info__field">{ride.seats}</div>
            </div>

          </div>
        </div>
        <div className="ride-detail__right">
          <div className="ride-detail-user">
            <h3>Fahrer</h3>
            <div className="ride-detail-user__user-info">
              <RideUser user={ride.user} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const RideDetailQuery = gql`
  query RideDetail($id:ID!) {
    ride(id: $id) {
      start
      end
      startDate
      price
      seats
      user {
        firstname
        lastname
        yearOfBirth
      }
    }
  }
`

export default graphql(RideDetailQuery, {
  options: (props) => ({
    variables: {id: props.match.params.id}
  })
})(RideDetail)