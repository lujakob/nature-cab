import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql}from 'react-apollo'
import {rideListQuery} from './RideListWithData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import "moment/locale/de"
import {GC_USER_ID, ACTIVITIES} from '../constants'

const hours = ['', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
const mins = ['', '00', '15', '30', '45']

const VIEWS = {
  FORM: 'FORM',
  SUCCESS: 'SUCCESS'
}

class CreateRide extends Component {


  constructor(props) {
    super(props)
    moment.locale('de')

    this.state = {
      ride: {
        name: '',
        start: '',
        end: '',
        activity: '',
        seats: 3,
        startDate: moment().add(4, 'days'),
        startTimeHour: '',
        startTimeMin: ''
      },
      error: null,
      view: VIEWS.FORM
    }

    this._handleDatePicker = this._handleDatePicker.bind(this)
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
                name="ride-start"
                onChange={(evt) => this._setFieldValue('start', evt.target.value)}
              />
            </div>
            <div className="ride-form-row">
              <label htmlFor="ride-end">Wohin geht die Fahrt?</label>
              <input
                type="text"
                placeholder="Seesauna, Tegernsee"
                value={this.state.ride.end}
                name="ride-end"
                onChange={(evt) => this._setFieldValue('end', evt.target.value)}
              />
            </div>
            <div className="ride-form-row">
              <label htmlFor="ride-activity">Welche Aktivität haben Sie vor?</label>
              <select
                onChange={(evt) => this._setFieldValue('activity', evt.target.value)}
                name="ride-activity"
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
                  popperClassName="date-picker-container"
                  selected={this.state.ride.startDate}
                  onChange={this._handleDatePicker}
                  dateFormat="LL"
                />
                <select
                  className="select-start-time-hour"
                  onChange={(evt) => {
                    this._setFieldValue('startTimeHour', evt.target.value)
                    this._syncStartTimeFields(evt.target.value)
                  }}
                  value={this.state.ride.startTimeHour}
                  name="ride-start-time-hour"
                >
                  {hours.map((hour, index) => {
                    return <option key={index} value={hour}>{hour}</option>
                  })}
                </select>
                <div className="select-start-time-spacer">:</div>
                <select
                  className="select-start-time-min"
                  onChange={(evt) => this._setFieldValue('startTimeMin', evt.target.value)}
                  value={this.state.ride.startTimeMin}
                  name="ride-start-time-min"
                >
                  {mins.map((min, index) => {
                    return <option key={index} value={min}>{min}</option>
                  })}
                </select>
                <div className="select-start-time-spacer select-start-time-spacer--time">Uhr</div>

                <br style={{clear: "both"}}/>
              </div>
            </div>
            <div className="ride-form-row">
              <label htmlFor="ride-return-info">Infos zur Rückfahrt</label>
              <textarea name="ride-return-info"></textarea>
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

  _handleDatePicker(date) {
    this.setState({
      ride: {
        ...this.state.ride,
        startDate: date
      },
    })
  }

  /**
   * set field value on state, reset error prop
   * @param key
   * @param val
   * @private
   */
  _setFieldValue(key, val) {
    let newState = Object.assign({}, this.state, {error: null})
    newState['ride'][key] = val
    this.setState(newState)
  }

  _syncStartTimeFields(value) {
    let newState = null
    if (this.state.ride.startTimeMin === '' && value !== '') {
      newState = {
        ride: {
          ...this.state.ride,
          startTimeMin: '15'
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

    if (this._formIsValid(this.state.ride)) {

      const userId = localStorage.getItem(GC_USER_ID)
      const {ride} = this.state

      // add userId
      ride.userId = userId
      await this.props.addRideMutation({
        variables: {
          ride
        },
        update: (store, { data: { addRide } }) => {

          // show success message
          this.setState({view: VIEWS.SUCCESS})

          // if rideListQuery was not queried yet, the store has no 'rides' prop and will err
          try {
            const data = store.readQuery({ query: rideListQuery });
            data.rides.push(Object.assign({}, {id: Math.round(Math.random() * -1000000)}, addRide));
            store.writeQuery({ query: rideListQuery, data });
          } catch(e) {
            console.log('Update store not possible. Maybe it was not fetched yet.')
          }
        }
      })

      this.setState({'ride': {
        name: '',
        start: '',
        end: '',
        activity: '',
        seats: ''
      }})
    } else {
      this.setState({error: true})
    }
  }

  /**
   * check ride props for not empty
   * @param ride
   * @returns {boolean}
   * @private
   */
  _formIsValid(ride) {
    for (let prop in ride) {
      if (!ride[prop])
        return false
    }
    return true
  }

}

const AddRideMutation = gql`
  mutation addRide($ride: RideInput!) {
    addRide(ride: $ride) {
      name
      start
      end
      activity
      seats
    }
  }
`

export default graphql(AddRideMutation,{name: 'addRideMutation'})(CreateRide)