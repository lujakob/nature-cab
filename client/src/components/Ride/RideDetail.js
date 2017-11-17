import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import RideUser from './RideUser'
import {getActivityFromId, getFormattedDate} from '../../utils/misc'

class RideDetail extends Component {

  render() {

    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    const ride = this.props.data.ride

    if (!ride) {
      return <p>Sorry this ride is not available.</p>
    }

    return (
      <div>
        <div className="ride-detail cf">
          <div className="ride-detail__back-btn" onClick={this._goBack}>zurück zur Übersicht</div>
          <h3>{ride.startCity} - {ride.endCity}</h3>
          <div className="ride-detail__left">
            <div className="ride-detail-info">
              <div className="ride-detail-info__row cf">
                <div className="ride-detail-info__label">Abfahrtsort</div>
                <div className="ride-detail-info__field">{ride.startLocation}</div>
              </div>
              <div className="ride-detail-info__row cf">
                <div className="ride-detail-info__label">Ankunftsort</div>
                <div className="ride-detail-info__field">{ride.endLocation}</div>
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
                <RideUser user={ride.user} showVehicle="true" showDescription="true"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _goBack = () => {
    this.props.history.goBack()
  }
}

const RideDetailQuery = gql`
  query RideDetail($id:ID!) {
    ride(id: $id) {
      startCity,
      startLocation,
      endCity,
      endLocation,
      startDate
      price
      seats
      activity
      returnInfo
      user {
        firstname
        lastname
        yearOfBirth
        vehicle
        carType
        carColor
        description
      }
    }
  }
`

export default graphql(RideDetailQuery, {
  options: (props) => ({
    variables: {id: props.match.params.id}
  })
})(RideDetail)