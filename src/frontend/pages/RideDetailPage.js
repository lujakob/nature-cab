import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import RideUser from '../components/Ride/RideUser'
import {Link} from 'react-router-dom'
import {getActivityFromId, getFormattedDate, getVehicleTitleByKey, vehicleIsCar} from '../utils/misc'
import {VEHICLES} from '../../constants'
import FacebookShareButton from '../components/FacebookShareButton'
import {BASE_URL} from '../../config'
import {Helmet} from 'react-helmet'
import homeImg from '../img/home1.jpg'

class RideDetailPage extends Component {

  render() {

    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    const ride = this.props.data.ride

    if (!ride) {
      return <p>Sorry, die Fahrt mit dieser ID ist nicht vorhanden.</p>
    }

    const {match, location} = this.props
    const isUserPage = match.path.indexOf('/user') >= 0
    const rideEditUrl = `/user/ride/${match.params.id}/edit`
    const redirectedFromCreate = location.from === '/create'
    const shareUrl = `${BASE_URL}/rides/${match.params.id}`
    const image = `${BASE_URL}${homeImg}`
    const title = `NatureCab - Mitfahrgelegenheit von ${ride.startCity} nach ${ride.endCity}`
    const description = `Die Mitfahrgelegenheit zum ${getActivityFromId(ride.activity)} von ${ride.startCity} nach ${ride.endCity}`

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={shareUrl} />
          <meta property="og:url"           content={shareUrl} />
          <meta property="og:type"          content="website" />
          <meta property="og:title"         content={title} />
          <meta property="og:description"   content={description} />
          <meta property="og:image"         content={image} />
        </Helmet>

        <div className="ride-detail cf">
          {redirectedFromCreate &&
          <div className="ride-detail__message">
            <p>Deine Fahrt wurde gespeichert.</p>
          </div>
          }
          <div className="ride-detail__options-container cf">
            <div className="ride-detail__back-btn" onClick={this._goBack}>zurück zur Übersicht</div>

            {isUserPage &&
            <div className="ride-detail__options">
              <Link to={rideEditUrl}>bearbeiten</Link>
              <FacebookShareButton url={shareUrl} layout="button" />
            </div>
            }
          </div>

          <h3>{ride.startCity} - {ride.endCity}</h3>
          <div className="ride-detail__ride-info">
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
              <div className="ride-detail-info__row cf">
                <div className="ride-detail-info__label">Fahrzeug</div>
                <div className="ride-detail-info__field">
                  {this._getVehicle(ride)}
                </div>
              </div>

              {ride.returnInfo &&
              <div className="ride-detail-info__row ride-detail-info__row--return-info cf">
                <div className="ride-detail-info__label">Infos</div>
                <div className="ride-detail-info__field">{ride.returnInfo}</div>
              </div>
              }

            </div>
          </div>
          <div className="ride-detail__user-info">
            <div className="ride-detail-user">
              <h3>Fahrer</h3>
              <div className="ride-detail-user__user-info">
                <RideUser user={ride.user} showVehicle={vehicleIsCar(ride.vehicle, VEHICLES)} showDescription="true"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _getVehicle(ride) {
    if (vehicleIsCar(ride.vehicle, VEHICLES)) {
      return ride.user.carType + ', ' + ride.user.carColor
    } else {
      return getVehicleTitleByKey(ride.vehicle, VEHICLES)
    }
  }

  _goBack = () => {
    this.props.history.goBack()
  }
}

const RideDetailQuery = gql`
  query RideDetail($id:ID!) {
    ride(id: $id) {
      startCity
      startLocation
      endCity
      endLocation
      startDate
      price
      seats
      vehicle
      activity
      returnInfo
      user {
        firstname
        lastname
        yearOfBirth
        email
        phone
        picture
        carType
        carColor
        description
      }
    }
  }
`
const withData = graphql(RideDetailQuery, {
  options: (props) => ({
    variables: {id: props.match.params.id}
  })
}) 

export default withData(RideDetailPage)