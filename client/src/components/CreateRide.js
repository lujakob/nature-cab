import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql}from 'react-apollo'
import {rideListQuery} from './RideListWithData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/locale/de'
import {GC_USER_ID, ACTIVITIES, HOURS, MINS} from '../constants'

const rideSkipMandatoryFields = ['returnInfo']

const resetRide = {
  start: '',
  end: '',
  activity: '',
  seats: 3,
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

            <div className="ride-form-row">
              <label htmlFor="ride-start">Wo geht's los?</label>
              <input
                type="text"
                placeholder="Zum Beispiel: Marienplatz, München"
                value={this.state.ride.start}
                name="start"
                onChange={this._setFieldValue}
              />
            </div>
            <div className="ride-form-row">
              <label htmlFor="ride-end">Wohin geht die Fahrt?</label>
              <input
                type="text"
                placeholder="Zum Beispiel: Seesauna, Tegernsee"
                value={this.state.ride.end}
                name="end"
                onChange={this._setFieldValue}
              />
            </div>
            <div className="ride-form-row">
              <label htmlFor="ride-activity">Welche Aktivität haben Sie vor?</label>
              <select
                onChange={this._setFieldValue}
                name="activity"
              >
                {Object.keys(ACTIVITIES).map((activity, index) => {
                  return <option key={index} value={activity}>{activity}</option>
                })}
              </select>
            </div>
          </fieldset>

          <fieldset className="ride-form-fieldset">
            <h3>Datum und Uhrzeit</h3>

            <div className="ride-form-row">
              <label htmlFor="ride-start">Abfahrt</label>
              <div className="datepicker-wrapper">
                <DatePicker
                  placeholderText={moment().add(4, 'days').format('LL')}
                  selected={this.state.ride.startDate}
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
                <div className="select-start-time-spacer">:</div>
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
                <div className="select-start-time-spacer select-start-time-spacer--time">Uhr</div>

                <br style={{clear: "both"}}/>
              </div>
            </div>
            <div className="ride-form-row">
              <label htmlFor="ride-return-info">Infos zur Rückfahrt</label>
              <textarea
                name="returnInfo"
                placeholder="Zum Beispiel: Rückfahrt um 16:00 Uhr am Parkplatz"
                onChange={this._setFieldValue}
              ></textarea>
            </div>
          </fieldset>

          {this.state.error &&
          <div className="error-message dark-red">
            Please fill in all fields.
          </div>
          }

          <div className="ride-form-row ride-form-row--button">
            <button
              className='f6 link br3 ba ph3 pv2 mb2 dib white bg-blue'
              onClick={() => this._submit()}
            >
              Submit
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

    if (this._formIsValid(rideData)) {

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
    console.log(startDate)
    return Object.assign({}, {
      userId: localStorage.getItem(GC_USER_ID),
      start: this.state.ride.start,
      end: this.state.ride.end,
      activity: this.state.ride.activity,
      seats: this.state.ride.seats,
      startDate: startDate,
      returnInfo: this.state.ride.returnInfo
    })
  }

  /**
   * check ride props for not empty
   * @param ride
   * @returns {boolean}
   * @private
   */
  _formIsValid = (ride) => {
    for (let prop in ride) {
      let isMandatory = !rideSkipMandatoryFields.includes(prop)

      if (isMandatory && !ride[prop]) {
        return false
      }
    }
    return true
  }

}

const AddRideMutation = gql`
  mutation addRide($ride: RideInput!) {
    addRide(ride: $ride) {
      id
      userId
      start
      end
      activity
      seats
      startDate
      returnInfo
    }
  }
`

export default graphql(AddRideMutation, {name: 'addRideMutation'})(CreateRide)