import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import RideUser from './RideUser'
import {getActivityFromId, getFormattedDate} from '../utils/misc'

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
      <div>
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
                  {getFormattedDate(ride.startDate)}
                </div>
              </div>
              {getActivityFromId(ride.activity) &&
              <div className="ride-detail-info__row cf">
                <div className="ride-detail-info__label">Aktivität</div>
                <div className="ride-detail-info__field">{getActivityFromId(ride.activity)}</div>
              </div>
              }
              <div className="ride-detail-info__row cf">
                <div className="ride-detail-info__label">Preis pro Mitfahrer</div>
                <div className="ride-detail-info__field">{ride.price} &euro;</div>
              </div>
              <div className="ride-detail-info__row cf">
                <div className="ride-detail-info__label">Anzahl der Plätze</div>
                <div className="ride-detail-info__field">{ride.seats}</div>
              </div>
              <div className="ride-detail-info__row ride-detail-info__row--return-info cf">
                <div className="ride-detail-info__label">Infos</div>
                <div className="ride-detail-info__field">{ride.returnInfo}</div>
              </div>

            </div>
          </div>
          <div className="ride-detail__right">
            <div className="ride-detail-user">
              <h3>Fahrer</h3>
              <div className="ride-detail-user__user-info">
                <RideUser user={ride.user} showCar="true"/>
              </div>
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
      activity
      returnInfo
      user {
        firstname
        lastname
        yearOfBirth
        car
        carColor
      }
    }
  }
`

export default graphql(RideDetailQuery, {
  options: (props) => ({
    variables: {id: props.match.params.id}
  })
})(RideDetail)