import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql}from 'react-apollo'
import {rideListQuery} from './RideListWithData'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import "moment/locale/de"
import {GC_USER_ID, ACTIVITIES} from '../constants'

const VIEWS = {
  FORM: 'FORM',
  SUCCESS: 'SUCCESS'
}

class CreateRide extends Component {


  constructor(props) {
    super(props)

    console.log(moment.locale('de'));
    console.log(moment().add(4, 'days').format('LL'))

    this.state = {
      ride: {
        name: '',
        start: '',
        end: '',
        activity: '',
        seats: 3,
        startDate: moment().add(4, 'days')
      },
      error: null,
      view: VIEWS.FORM
    }


    this._handleDatePicker = this._handleDatePicker.bind(this)
  }
  componentWillMount() {

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
            <h3>Abfahrt und Ankunft</h3>

            <div className="ride-form-row">
              <label htmlFor="ride-start">Datum und Uhrzeit</label>
              <DatePicker
                selected={this.state.ride.startDate}
                onChange={this._handleDatePicker}
                dateFormat="LL"
              />
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