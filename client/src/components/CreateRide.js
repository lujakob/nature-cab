import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql}from 'react-apollo'
import {rideListQuery} from './RideListWithData'
import {GC_USER_ID} from '../constants'

class CreateRide extends Component {
  state = {
    ride: {
      name: '',
      start: '',
      end: '',
      activity: '',
      seats: ''
    },
    error: null
  }

  render() {
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
          <input
            type="text"
            placeholder="Activity"
            value={this.state.ride.activity}
            onChange={(evt) => this._setFieldValue('activity', evt.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Seats"
            value={this.state.ride.seats}
            onChange={(evt) => this._setFieldValue('seats', evt.target.value)}
          />
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