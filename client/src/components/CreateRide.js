import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql}from 'react-apollo'
import {rideListQuery} from './Ride/RideListWithData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/locale/de'
import {GC_USER_ID, ACTIVITIES, HOURS, MINS} from '../constants'
import {formIsValid, isNormalInteger} from '../utils/misc'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

const rideSkipMandatoryFields = ['returnInfo' , 'startLatLng', 'startCity', 'endLatLng', 'endCity', 'activity']

const resetRide = {
  startLocation: '',
  endLocation: '',
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
      ride: resetRide,
      error: null,
      view: VIEWS.FORM
    }
  }


  render() {

    if (this.state.view === VIEWS.FORM) {
      return (
        <div>
          <fieldset className="ride-form-fieldset">
            <h3>Abfahrt und Ankunft</h3>

            <div className="form-row">
              <label htmlFor="startLocation">Wo geht's los?</label>
              <PlacesAutocomplete inputProps={{
                placeholder: "Zum Beispiel: Marienplatz, München",
                value: this.state.ride.startLocation,
                name: "startLocation",
                onChange: value => this._setStateForField('startLocation', value)
              }} />

            </div>
            <div className="form-row">
              <label htmlFor="endLocation">Wohin geht die Fahrt?</label>
              <PlacesAutocomplete inputProps={{
                placeholder: "Zum Beispiel: Seesauna, Tegernsee",
                value: this.state.ride.endLocation,
                name: "endLocation",
                onChange: value => this._setStateForField('endLocation', value)
              }} />

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
      )
    } else if (this.state.view === VIEWS.SUCCESS) {
      return (
        <div>Your ride was saved successfully.</div>
      )
    }

  }

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

  _setStateForField(name, value) {
    let newState = Object.assign({}, this.state, {error: null})
    newState['ride'][name] = value
    this.setState(newState)
  }

  _setPriceValue = (evt) => {
    let {value} = evt.target

    if(isNormalInteger(value) || value === '') {
      let newState = Object.assign({}, this.state, {error: null})
      newState['ride']['price'] = value
      this.setState(newState)
    }
  }

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
            const data = store.readQuery({query: rideListQuery, variables});
            data.rides.push(Object.assign({}, addRide));
            store.writeQuery({query: rideListQuery, variables, data});
          } catch(e) {
            console.log('Update store not possible.', e)
          }
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
    let startGeocodeByAddress = await geocodeByAddress(ride.startLocation)
    let startLatLng = await getLatLng(startGeocodeByAddress[0])

    console.log("startLatLng", startLatLng)

    let endGeocodeByAddress = await geocodeByAddress(ride.endLocation)
    let endLatLng = await getLatLng(endGeocodeByAddress[0])

    return Object.assign({}, {
      user: localStorage.getItem(GC_USER_ID),
      startLocation: ride.startLocation,
      startLatLng: [startLatLng.lat, startLatLng.lng],
      startCity: this._getCity(startGeocodeByAddress[0]['address_components']),
      endLocation: ride.endLocation,
      endLatLng: [endLatLng.lat, endLatLng.lng],
      endCity: this._getCity(endGeocodeByAddress[0]['address_components']),

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