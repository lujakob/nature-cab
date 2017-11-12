import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql}from 'react-apollo'
import {rideListQuery} from './RideListWithData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/locale/de'
import {GC_USER_ID, ACTIVITIES, HOURS, MINS} from '../constants'
import {formIsValid} from '../utils/misc'

const rideSkipMandatoryFields = ['returnInfo']

const resetRide = {
  start: '',
  end: '',
  activity: '',
  seats: 3,
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
              <label htmlFor="ride-start">Wo geht's los?</label>
              <input
                type="text"
                placeholder="Zum Beispiel: Marienplatz, München"
                value={this.state.ride.start}
                name="start"
                onChange={this._setFieldValue}
              />
            </div>
            <div className="form-row">
              <label htmlFor="ride-end">Wohin geht die Fahrt?</label>
              <input
                type="text"
                placeholder="Zum Beispiel: Seesauna, Tegernsee"
                value={this.state.ride.end}
                name="end"
                onChange={this._setFieldValue}
              />
            </div>
            <div className="form-row">
              <label htmlFor="ride-activity">Welche Aktivität haben Sie vor?</label>
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
              <label htmlFor="price">Preis pro Mitfahrer (in &euro;)</label>
              <input
                type="text"
                placeholder="Zum Beispiel: 10"
                value={this.state.ride.price}
                name="price"
                onChange={this._setFieldValue}
              />
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

    let newState = Object.assign({}, this.state, {error: null})
    newState['ride'][name] = value
    this.setState(newState)
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

    let rideData = this._buildRide()

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
            const data = store.readQuery({ query: rideListQuery, variables: {start: '', end: '', activity: ''} });
            data.rides.push(Object.assign({}, addRide));
            store.writeQuery({ query: rideListQuery, data });
          } catch(e) {
            console.log('Update store not possible. Maybe it was not fetched yet.', e)
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
  _buildRide() {
    let startDate = this.state.ride.startDate
      .add(parseInt(this.state.ride.startTimeHour, 10), 'hours')
      .add(parseInt(this.state.ride.startTimeMin, 10), 'minutes')
      .toDate()

    return Object.assign({}, {
      user: localStorage.getItem(GC_USER_ID),
      start: this.state.ride.start,
      end: this.state.ride.end,
      activity: this.state.ride.activity,
      seats: this.state.ride.seats,
      price: parseInt(this.state.ride.price, 10),
      startDate: startDate,
      returnInfo: this.state.ride.returnInfo
    })
  }

}

const AddRideMutation = gql`
  mutation addRide($ride: RideInput!) {
    addRide(ride: $ride) {
      _id
      start
      end
      activity
      seats
      startDate
      returnInfo
      user {
        firstname
        lastname
        car
      }
    }
  }
`

export default graphql(AddRideMutation, {name: 'addRideMutation'})(CreateRide)