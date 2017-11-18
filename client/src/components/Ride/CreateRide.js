import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql}from 'react-apollo'
import {rideListQuery} from './RideListWithData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/locale/de'
import {GC_USER_ID, ACTIVITIES, HOURS, MINS} from '../../constants'
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

  render() {
    if (this.state.view === VIEWS.FORM) {
      return (
        <div className="create-ride-container cf">
          <div className="create-ride-left-col">
            <fieldset className="ride-form-fieldset">
              <h3>Abfahrt und Ankunft</h3>

              <div className="form-row">
                <label htmlFor="startLocation">Wo geht's los?</label>
                <PlacesAutocomplete
                  inputProps={{
                    placeholder: "Zum Beispiel: Marienplatz, München",
                    value: this.state.ride.startLocation,
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
                    value: this.state.ride.endLocation,
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
                >
                  {ACTIVITIES.map((activity, index) => {
                    return <option key={index} value={activity.id}>{activity.title}</option>
                  })}
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="seats">Wie viele Plätze sind frei?</label>
                <select
                  onChange={this._setFieldValue}
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
                    value={this.state.ride.price}
                    name="price"
                    onChange={this._setPriceValue}
                  />
                  <div className="content-placeholder-container">
                    <div className="content-placeholder-spacer">
                      {this.state.ride.price}
                    </div>
                    <div className="content-placeholder-value">
                      {this.state.ride.price.length > 0 &&
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
                    selected={this.state.ride.startDate}
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
                    value={this.state.ride.startTimeHour}
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
                    value={this.state.ride.startTimeMin}
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
                <label htmlFor="ride-return-info">Infos zur Rückfahrt</label>
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
            <RidePreviewMap startLatLng={this.state.ride.startLatLng} endLatLng={this.state.ride.endLatLng} />
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
    let latLng = await getLatLng(startGeocodeByAddress[0])
    let city = this._getCity(startGeocodeByAddress[0]['address_components'])
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

    let rideData = await this._buildRide()

    if (formIsValid(rideData, rideSkipMandatoryFields)) {

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

          this._resetFormState()
        }
      })

      this.setState({'ride': resetRide})

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
  async _buildRide() {
    const {ride} = this.state

    return Object.assign({}, {
      user: localStorage.getItem(GC_USER_ID),
      startLocation: ride.startLocation,
      startLatLng: [ride.startLatLng.lat, ride.startLatLng.lng],
      startCity: ride.startCity,
      endLocation: ride.endLocation,
      endLatLng: [ride.endLatLng.lat, ride.endLatLng.lng],
      endCity: ride.endCity,

      activity: ride.activity,
      seats: ride.seats,
      price: parseInt(ride.price, 10),
      startDate: this._getStartDate(ride.startDate),
      returnInfo: ride.returnInfo
    })
  }

  _getCity(addressComponents) {
    // find city name element and return 'long_name' property
    let cityComponent = addressComponents.find(el => el.types.includes('locality'))
    return !!cityComponent ? cityComponent['long_name'] : ''
  }

  _getStartDate(startDate) {
    return startDate
      .add(parseInt(startDate.startTimeHour, 10), 'hours')
      .add(parseInt(startDate.startTimeMin, 10), 'minutes')
      .toDate()
  }

  _resetFormState() {
    this.setState({ride: resetRide})
  }
}

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

export default graphql(AddRideMutation, {name: 'addRideMutation'})(CreateRide)