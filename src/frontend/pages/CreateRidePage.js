import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql, compose}from 'react-apollo'
import {rideListQuery} from '../components/Ride/RideListWithData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/locale/de'
import {GC_USER_ID, ACTIVITIES, HOURS, MINS, VEHICLES} from '../../constants'
import {GOOGLE_KEYS} from '../../config'
import {formIsValid, isNormalInteger} from '../utils/misc'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import RidePreviewMap from '../components/Ride/RidePreviewMap'
import LocalStorage from '../utils/localStorage'
import scriptLoader from 'react-async-script-loader'
import {getSortedActivities} from '../utils/misc'

const asyncScriptSrc = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEYS.MAPS}&libraries=places`
const rideSkipMandatoryFields = ['description' , 'startLatLng', 'startCity', 'endLatLng', 'endCity', 'activity', 'returnInfo']

const resetRide = {
  startLocation: '',
  startLatLng: {lat: null, lng: null},
  startCity: '',
  endLocation: '',
  endLatLng: {lat: null, lng: null},
  endCity: '',
  activity: '',
  seats: 1,
  vehicle: VEHICLES[0]['value'],
  price: '',
  startDate: null,
  startTimeHour: '',
  startTimeMin: '',
  returnInfo: '',
  description: ''
}

const VIEWS = {
  FORM: 'FORM',
  SUCCESS: 'SUCCESS'
}

class CreateRide extends Component {

  activities = getSortedActivities(ACTIVITIES)

  constructor(props) {
    super(props)
    moment.locale('de')

    this.state = {
      ride: Object.assign({}, resetRide),
      error: null,
      view: VIEWS.FORM
    }
  }

  /**
   * componentWillReceiveProps - preset ride data from query result for form fields
   * @param nextProps
   */
  componentWillReceiveProps({data}) {
    if (data && data.ride) {
      const ride = data.ride
      const newState = Object.assign({}, this.state, {
        ride: {
          startLocation: ride.startLocation,
          startLatLng: ride.startLatLng,
          startCity: ride.startCity,
          endLocation: ride.endLocation,
          endLatLng: ride.endLatLng,
          endCity: ride.endCity,
          activity: ride.activity,
          seats: ride.seats,
          vehicle: ride.vehicle,
          price: ride.price,
          startDate: moment(new Date(ride.startDate)),
          startTimeHour: moment(new Date(ride.startDate)).format('kk'),
          startTimeMin: moment(new Date(ride.startDate)).format('mm'),
          returnInfo: ride.returnInfo || '',
          description: ride.description || ''
        }})
      this.setState(newState)
    }
  }

  render() {
    const {ride, view} = this.state
    const {match} = this.props

    if (view === VIEWS.FORM) {
      return (
        <div className="create-ride-container cf">

          {match.params.id &&
          <p>Fahrt bearbeiten: {ride.startCity} - {ride.endCity}</p>
          }
          <div className="create-ride-left-col">
            <fieldset className="ride-form-fieldset">
              <h3>Abfahrt und Ankunft</h3>

              <div className={'form-row ' + this._getErrorClass('startLocation')}>
                <label htmlFor="startLocation">Wo geht's los?</label>
                {this.props.isScriptLoaded &&
                <PlacesAutocomplete
                  inputProps={{
                    placeholder: "Zum Beispiel: Marienplatz, München",
                    value: ride.startLocation,
                    name: "startLocation",
                    onChange: value => this._setStateForField('startLocation', value),
                    onBlur: e => {
                      e.target.value.length === 0 && this._placesOnSelect('', ['startLatLng', 'startCity'])
                    }
                  }}
                  onSelect={(address) => this._placesOnSelect(address, ['startLatLng', 'startCity'])}
                />
                }


              </div>
              <div className={'form-row ' + this._getErrorClass('endLocation')}>
                <label htmlFor="endLocation">Wohin geht die Fahrt?</label>
                {this.props.isScriptLoaded &&
                <PlacesAutocomplete
                  inputProps={{
                    placeholder: "Zum Beispiel: Seesauna, Tegernsee",
                    value: ride.endLocation,
                    name: "endLocation",
                    onChange: value => this._setStateForField('endLocation', value),
                    onBlur: e => e.target.value.length === 0 && this._placesOnSelect('', ['endLatLng', 'endCity'])
                  }}
                  onSelect={(address) => this._placesOnSelect(address, ['endLatLng', 'endCity'])}
                />
                }
              </div>
              <div className="form-row">
                <label htmlFor="ride-activity">Welche Aktivität hast Du vor?</label>
                <select
                  onChange={this._setFieldValue}
                  name="activity"
                  value={ride.activity}
                >
                  {this.activities.map((activity, index) => {
                    return <option key={index} value={activity.id}>{activity.title}</option>
                  })}
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="vehicle">Mit welchem Fahrzeug?</label>

                <select
                  id="vehicle"
                  onChange={this._setFieldValue}
                  value={ride.vehicle}
                  name="vehicle"
                >
                  {VEHICLES.map((type, index) => {
                    return <option key={index} value={type.value}>{type.title}</option>
                  })}
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="seats">Wie viele Plätze sind frei?</label>
                <select
                  onChange={this._setFieldValue}
                  value={ride.seats}
                  name="seats"
                >
                  {[1,2,3,4].map((number, index) => {
                    return <option key={index} value={number}>{number}</option>
                  })}
                </select>
              </div>
              <div className={'form-row ' + this._getErrorClass('price')}>
                <label htmlFor="price">Preis pro Mitfahrer</label>
                <div className="content-placeholder-wrapper">
                  <input
                    type="text"
                    placeholder="Zum Beispiel: 10€"
                    value={ride.price}
                    name="price"
                    onChange={this._setPriceValue}
                  />
                  <div className="content-placeholder-container">
                    <div className="content-placeholder-spacer">
                      {ride.price}
                    </div>
                    <div className="content-placeholder-value">
                      {ride.price.length > 0 &&
                      <span>&euro;</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="ride-form-fieldset">
              <h3>Datum und Uhrzeit</h3>

              <div className="form-row">
                <label htmlFor="ride-start">Abfahrt</label>
                <div className={'datepicker-wrapper cf ' + this._getErrorClass('startDate')}>
                  <DatePicker
                    placeholderText={moment().add(4, 'days').format('LL')}
                    selected={ride.startDate}
                    minDate={moment()}
                    onChange={this._handleDatePicker}
                    dateFormat="LL"
                  />
                  <select
                    className={'select-start-time-hour ' + this._getErrorClass('startTimeHour')}
                    onChange={(evt) => {
                      this._setFieldValue(evt)
                      this._syncStartTimeFields(evt.target.value)
                    }}
                    value={ride.startTimeHour}
                    name="startTimeHour"
                  >
                    {HOURS.map((hour, index) => {
                      return <option key={index} value={hour}>{hour}</option>
                    })}
                  </select>
                  <div className="time-spacer">:</div>
                  <select
                    className={'select-start-time-min ' + this._getErrorClass('startTimeMin')}
                    onChange={this._setFieldValue}
                    value={ride.startTimeMin}
                    name="startTimeMin"
                  >
                    {MINS.map((min, index) => {
                      return <option key={index} value={min}>{min}</option>
                    })}
                  </select>
                  <div className="time-spacer select-time-spacer--time">Uhr</div>

                  <br style={{clear: "both"}}/>
                </div>
              </div>

              <div className={'form-row'}>
                <label htmlFor="returnInfo">Rückfahrt</label>
                <input
                  type="text"
                  placeholder="Zum Beispiel: ca 17 Uhr"
                  value={ride.returnInfo}
                  name="returnInfo"
                  onChange={this._setFieldValue}
                />
              </div>
            </fieldset>

            <fieldset className="ride-form-fieldset">
              <h3>Infos</h3>
              <div className="form-row">
                <label htmlFor="ride-return-info">Mehr Infos zur Fahrt</label>
                <textarea
                  name="description"
                  placeholder="Zum Beispiel: Rückfahrt um 16:00 Uhr am Parkplatz"
                  onChange={this._setFieldValue}
                />
              </div>
            </fieldset>

            {this.state.error &&
            <div className="form-message dark-red">
              Bitte füllen Sie alle Felder aus.
            </div>
            }

            <div className="form-submit">
              <button
                className='link white bg-blue btn-primary'
                onClick={() => this._submit()}
              >
                Senden
              </button>
            </div>

          </div>
          <div className="create-ride-right-col">
            {this.props.isScriptLoaded &&
            <RidePreviewMap startLatLng={ride.startLatLng} endLatLng={ride.endLatLng} />
            }
          </div>
        </div>
      )
    } else if (this.state.view === VIEWS.SUCCESS) {
      return (
        <div>Ihre Fahrt wurde abgespeichert. <br/>Sie kann im Benutzerprofil nachträglich bearbeitet werden.</div>
      )
    }

  }

  _getErrorClass(field) {
    return this.state.error && !this.state.ride[field] ? 'is-error' : ''
  }

  /**
   * _placesOnSelect
   * @param address
   * @param fieldName - array of fields to set: [0] => latLng, [1], city
   * @private
   */
  _placesOnSelect = async (address, fieldName) => {
    if (address.length > 0) {
      let startGeocodeByAddress = await geocodeByAddress(address)
      let {lat, lng} = await getLatLng(startGeocodeByAddress[0])
      let city = this._getCity(startGeocodeByAddress[0]['address_components'])
      this._setValuesForDestination(fieldName, [lat, lng], city)
    } else {
      this._setValuesForDestination(fieldName)
    }
  }

  /**
   * _setValuesForDestination
   * @param fieldName
   * @param latLng
   * @param city
   * @private
   */
  _setValuesForDestination(fieldName, latLng = [], city = '') {
    this._setStateForField(fieldName[0], latLng)
    this._setStateForField(fieldName[1], city)
  }

  /**
   * _handleDatePicker
   * @param date
   * @private
   */
  _handleDatePicker = (date) => {
    this.setState({
      ride: {
        ...this.state.ride,
        startDate: date
      },
    })
  }

  /**
   * set field value on state, reset error prop
   * @param evt
   * @private
   */
  _setFieldValue = (evt) => {
    let {name, value} = evt.target
    this._setStateForField(name, value)
  }

  /**
   * _setStateForField
   * @param name
   * @param value
   * @private
   */
  _setStateForField(field, value) {
    let newState = Object.assign({}, this.state, {error: null})
    newState['ride'][field] = value
    this.setState(newState)
  }

  /**
   * _setPriceValue
   * @param evt
   * @private
   */
  _setPriceValue = (evt) => {
    let {value} = evt.target

    if(isNormalInteger(value) || value === '') {
      let newState = Object.assign({}, this.state, {error: null})
      newState['ride']['price'] = value
      this.setState(newState)
    }
  }

  /**
   * _syncStartTimeFields
   * @param value
   * @private
   */
  _syncStartTimeFields = (value) => {
    let newState = null
    if (this.state.ride.startTimeMin === '' && value !== '') {
      newState = {
        ride: {
          ...this.state.ride,
          startTimeMin: '00'
        }
      }
    }
    if (value === '') {
      newState = {
        ride: {
          ...this.state.ride,
          startTimeMin: ''
        }
      }
    }
    this.setState(newState)
  }

  /**
   * submit form
   * @private
   */
  _submit = async () => {

    const _id = this.props.match.params.id
    const isCreateMode = !this.props.match.params.id

    let rideData = this._buildRide()

    if (formIsValid(rideData, rideSkipMandatoryFields)) {

      rideData = Object.assign(rideData, {_id})

      await this.props.addRideMutation({
        variables: {
          ride: rideData
        },
        update: (store, { data: { addRide } }) => {

          // if rideListQuery was not queried yet, the store has no 'rides' prop and will err
          try {
            const variables = {start: '', end: '', activity: ''}
            const data = store.readQuery({query: rideListQuery, variables})
            data.rides.rides.push(Object.assign({}, addRide))
            data.rides.total++
            store.writeQuery({query: rideListQuery, variables, data})
          } catch(e) {
            console.log('Update store not possible.', e)
          }

          try {
            const variables = {id: _id}
            const data = store.readQuery({query: RideDetailQuery, variables})
            data.ride = Object.assign({}, addRide)
            store.writeQuery({query: RideDetailQuery, variables, data})
          } catch(e) {
            console.log('Update store not possible.', e)
          }

          isCreateMode && this._resetFormState()

          // redirect to detail page
          this.props.history.push({pathname: `/user/ride/${addRide._id}`, from: '/create'})

        }
      })

      isCreateMode && this.setState({'ride': resetRide})

    } else {
      this.setState({error: true})
    }
  }

  /**
   * _buildRide
   * - add userId
   * - add date object
   * @returns {*}
   * @private
   */
  _buildRide() {
    const {ride} = this.state

    return Object.assign({}, {
      user: LocalStorage.getItem(GC_USER_ID),
      startLocation: ride.startLocation,
      startLatLng: ride.startLatLng,
      startCity: ride.startCity,
      endLocation: ride.endLocation,
      endLatLng: ride.endLatLng,
      endCity: ride.endCity,

      activity: ride.activity,
      seats: ride.seats,
      vehicle: ride.vehicle,
      price: parseInt(ride.price, 10),
      startDate: this._getStartDate(ride),
      returnInfo: ride.returnInfo,
      description: ride.description
    })
  }

  _getCity(addressComponents) {
    // find city name element and return 'long_name' property
    let cityComponent = addressComponents.find(el => el.types.includes('locality'))
    return !!cityComponent ? cityComponent['long_name'] : ''
  }

  /**
   * _getStartDate - returns date as moment object with hours and mins added or ''
   * @param ride - ride data
   * @returns {Date|*} - native date object
   * @private
   */
  _getStartDate(ride) {
    const {startDate, startTimeHour, startTimeMin} = ride
    return startDate && startDate._isAMomentObject
      ? startDate
        .startOf('day')
        .add(parseInt(startTimeHour, 10), 'hours')
        .add(parseInt(startTimeMin, 10), 'minutes')
        .toDate()
      : ''
  }

  _resetFormState() {
    this.setState({ride: resetRide})
  }
}

const RideDetailQuery = gql`
  query RideDetail($id:ID!) {
    ride(id: $id) {
      startCity
      startLocation
      startLatLng
      endCity
      endLocation
      endLatLng
      startDate
      returnInfo
      price
      seats
      vehicle
      activity
      description
    }
  }
`

const AddRideMutation = gql`
  mutation addRide($ride: RideInput!) {
    addRide(ride: $ride) {
      _id
      startLocation
      startCity
      startLatLng
      endLocation
      endCity
      endLatLng
      activity
      price
      seats
      vehicle
      startDate
      returnInfo
      description
      user {
        firstname
        lastname
        carType
        yearOfBirth
      }
    }
  }
`

export const withData = compose(
  graphql(RideDetailQuery, {
    options: ({match}) => {
      const id = match.params.id
      return {variables: {id}}
    },
    // skip getting ride detail data if in create form
    skip: ({match}) => !match.params.id
  }),
  graphql(AddRideMutation, {name: 'addRideMutation'})
)

export default scriptLoader(asyncScriptSrc)(withData(CreateRide))