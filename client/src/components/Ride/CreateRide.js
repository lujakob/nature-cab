import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql, compose}from 'react-apollo'
import {rideListQuery} from './RideListWithData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/locale/de'
import {GC_USER_ID, ACTIVITIES, HOURS, MINS, VEHICLES} from '../../constants'
import {formIsValid, isNormalInteger} from '../../utils/misc'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import RidePreviewMap from './RidePreviewMap'

const rideSkipMandatoryFields = ['returnInfo' , 'startLatLng', 'startCity', 'endLatLng', 'endCity', 'activity']

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
  startDate: '',
  startTimeHour: '',
  startTimeMin: '',
  returnInfo: ''
}

const VIEWS = {
  FORM: 'FORM',
  SUCCESS: 'SUCCESS'
}

class CreateRide extends Component {

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
  componentWillReceiveProps(nextProps) {
    const {ride} = nextProps.data

    if (ride) {
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
          returnInfo: ride.returnInfo
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

              <div className="form-row">
                <label htmlFor="startLocation">Wo geht's los?</label>
                <PlacesAutocomplete
                  inputProps={{
                    placeholder: "Zum Beispiel: Marienplatz, München",
                    value: ride.startLocation,
                    name: "startLocation",
                    onChange: value => this._setStateForField('startLocation', value)
                  }}
                  onSelect={(address, placeId) => this._placesOnSelect(address, placeId, ['startLatLng', 'startCity'])}
              />

              </div>
              <div className="form-row">
                <label htmlFor="endLocation">Wohin geht die Fahrt?</label>
                <PlacesAutocomplete
                  inputProps={{
                    placeholder: "Zum Beispiel: Seesauna, Tegernsee",
                    value: ride.endLocation,
                    name: "endLocation",
                    onChange: value => this._setStateForField('endLocation', value)
                  }}
                  onSelect={(address, placeId) => this._placesOnSelect(address, placeId, ['endLatLng', 'endCity'])}
                />

              </div>
              <div className="form-row">
                <label htmlFor="ride-activity">Welche Aktivität hast Du vor?</label>
                <select
                  onChange={this._setFieldValue}
                  name="activity"
                  value={ride.activity}
                >
                  {ACTIVITIES.map((activity, index) => {
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
              <div className="form-row">
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
                <div className="datepicker-wrapper">
                  <DatePicker
                    placeholderText={moment().add(4, 'days').format('LL')}
                    selected={ride.startDate}
                    minDate={moment()}
                    onChange={this._handleDatePicker}
                    dateFormat="LL"
                  />
                  <select
                    className="select-start-time-hour"
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
                    className="select-start-time-min"
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
              <div className="form-row">
                <label htmlFor="ride-return-info">Infos zur Fahrt</label>
                <textarea
                  name="returnInfo"
                  placeholder="Zum Beispiel: Rückfahrt um 16:00 Uhr am Parkplatz"
                  onChange={this._setFieldValue}
                />
              </div>
            </fieldset>

            {this.state.error &&
            <div className="error-message dark-red">
              Please fill in all fields.
            </div>
            }

            <div className="form-row form-row--button-right">
              <button
                className='f6 link br3 ba ph3 pv2 mb2 dib white bg-blue'
                onClick={() => this._submit()}
              >
                Senden
              </button>
            </div>
          </div>
          <div className="create-ride-right-col">
            <RidePreviewMap startLatLng={ride.startLatLng} endLatLng={ride.endLatLng} />
          </div>
        </div>
      )
    } else if (this.state.view === VIEWS.SUCCESS) {
      return (
        <div>Your ride was saved successfully.</div>
      )
    }

  }

  /**
   * _placesOnSelect
   * @param address
   * @param placeId
   * @param fieldName - array of fields to set: [0] => latLng, [1], city
   * @private
   */
  _placesOnSelect = async (address, placeId, fieldName) => {
    let startGeocodeByAddress = await geocodeByAddress(address)
    let {lat, lng} = await getLatLng(startGeocodeByAddress[0])
    let city = this._getCity(startGeocodeByAddress[0]['address_components'])
    this._setStateForField(fieldName[0], [lat, lng])
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
  _setStateForField(name, value) {
    let newState = Object.assign({}, this.state, {error: null})
    newState['ride'][name] = value
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

    let rideData = this._buildRide()

    if (formIsValid(rideData, rideSkipMandatoryFields)) {

      rideData = Object.assign(rideData, {_id})

      await this.props.addRideMutation({
        variables: {
          ride: rideData
        },
        update: (store, { data: { addRide } }) => {

          // show success message
          this.setState({view: VIEWS.SUCCESS})

          // if rideListQuery was not queried yet, the store has no 'rides' prop and will err
          try {
            const variables = {start: '', end: '', activity: ''}
            const data = store.readQuery({query: rideListQuery, variables})
            data.rides.push(Object.assign({}, addRide))
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

          !_id && this._resetFormState()
        }
      })

      !_id && this.setState({'ride': resetRide})

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
      user: localStorage.getItem(GC_USER_ID),
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
      returnInfo: ride.returnInfo
    })
  }

  _getCity(addressComponents) {
    // find city name element and return 'long_name' property
    let cityComponent = addressComponents.find(el => el.types.includes('locality'))
    return !!cityComponent ? cityComponent['long_name'] : ''
  }

  /**
   *
   * @param ride - ride data
   * @returns {Date|*} - native date object
   * @private
   */
  _getStartDate(ride) {
    return ride.startDate
      .startOf('day')
      .add(parseInt(ride.startTimeHour, 10), 'hours')
      .add(parseInt(ride.startTimeMin, 10), 'minutes')
      .toDate()
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
      price
      seats
      vehicle
      activity
      returnInfo
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
      user {
        firstname
        lastname
        carType
        yearOfBirth
      }
    }
  }
`

export const CreateRideWithData = compose(
  graphql(RideDetailQuery, {
    options: ({match}) => {
      const id = match.params.id
      return {variables: {id}}
    },
    // skip getting ride detail data if in create form
    skip: ({match}) => !match.params.id
  }),
  graphql(AddRideMutation, {name: 'addRideMutation'})
)(CreateRide)