import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql}from 'react-apollo'
import {rideListQuery} from './RideListWithData'
import {GC_USER_ID, ACTIVITIES} from '../constants'

const VIEWS = {
  FORM: 'FORM',
  SUCCESS: 'SUCCESS'
}

class CreateRide extends Component {
  state = {
    ride: {
      name: '',
      start: '',
      end: '',
      activity: '',
      seats: 3
    },
    error: null,
    view: VIEWS.FORM
  }

  render() {
    if (this.state.view === VIEWS.FORM) {
      return (
        <div>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={this.state.ride.name}
              onChange={(evt) => this._setFieldValue('name', evt.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Start"
              value={this.state.ride.start}
              onChange={(evt) => this._setFieldValue('start', evt.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="End"
              value={this.state.ride.end}
              onChange={(evt) => this._setFieldValue('end', evt.target.value)}
            />
          </div>
          <div>
            <select
              onChange={(evt) => this._setFieldValue('activity', evt.target.value)}>
              {Object.keys(ACTIVITIES).map((activity, index) => {
                return <option key={index} value={activity}>{activity}</option>
              })}
            </select>
          </div>

          {this.state.error &&
          <div className="error-message dark-red">
            Please fill in all fields.
          </div>
          }

          <div>
            <div
              className='pointer mr2 button'
              onClick={() => this._submit()}
            >
              Submit
            </div>
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