import React, {Component} from 'react'
import {GC_USER_ID, TRANSPORTATION_TYPES} from '../constants'
import gql from 'graphql-tag'
import {graphql, compose} from 'react-apollo'
import {formIsValid, getYearOfBirthOptions} from '../utils/misc'

// these fields will be skipped in 'required' validation
const userSkipMandatoryFields = ['phone', 'car', 'carColor', 'description']

const VIEWS = {SUCCESS: 'SUCCESS'}

const defaultUser = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  yearOfBirth: '',
  vehicle: '',
  car: '',
  carColor: '',
  description: ''
}

class UserProfile extends Component {

  state = {
    user: defaultUser,
    error: null,
    view: null
  }

  /**
   * componentWillReceiveProps - preset user data from query result for form fields
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    console.log("jo")
    if (nextProps.data.user) {
      const newState = Object.assign({}, this.state, {
        user: {
          firstname: nextProps.data.user.firstname,
          lastname: nextProps.data.user.lastname,
          email: nextProps.data.user.email,
          phone: nextProps.data.user.phone,
          yearOfBirth: nextProps.data.user.yearOfBirth,
          vehicle: nextProps.data.user.vehicle,
          car: nextProps.data.user.car,
          carColor: nextProps.data.user.carColor,
          description: nextProps.data.user.description
        }})
      this.setState(newState)
    }
  }

  componentWillUnmount() {
    this.setState({user: defaultUser})
  }

  render() {

    const {data: {loading, error}} = this.props

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }

    return (
      <div>
        <fieldset className="form-fieldset">
          <h3>Deine persönlichen Daten</h3>

          <div className="form-row">
            <label htmlFor="firstname">Vorname</label>
            <input
              id="firstname"
              type="text"
              value={this.state.user.firstname}
              name="firstname"
              onChange={this._setFieldValue}
            />
          </div>

          <div className="form-row">
            <label htmlFor="lastname">Nachname</label>
            <input
              id="lastname"
              type="text"
              value={this.state.user.lastname}
              name="lastname"
              onChange={this._setFieldValue}
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={this.state.user.email}
              name="email"
              onChange={this._setFieldValue}
            />
          </div>

          <div className="form-row">
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone"
              type="text"
              value={this.state.user.phone}
              name="phone"
              onChange={this._setFieldValue}
            />
          </div>

          <div className="form-row">
            <label htmlFor="yearOfBirth">Geburtsjahr</label>
            <select
              id="yearOfBirth"
              onChange={this._setFieldValue}
              value={this.state.user.yearOfBirth}
              name="yearOfBirth"
            >
              <option value="">Geburtsjahr</option>
              {getYearOfBirthOptions().map((year, index) => {
                return <option key={index} value={year}>{year}</option>
              })}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="description">Infos</label>
            <textarea
              id="description"
              type="text"
              name="description"
              value={this.state.user.description}
              onChange={this._setFieldValue}
            />
          </div>
        </fieldset>

        <fieldset className="form-fieldset">
          <h3>Verkehrsmittel</h3>

          <div className="form-row">
            <select
              id="vehicle"
              onChange={this._setFieldValue}
              value={this.state.user.vehicle}
              name="vehicle"
            >
              {TRANSPORTATION_TYPES.map((type, index) => {
                return <option key={index} value={type.value}>{type.title}</option>
              })}
            </select>
          </div>

          {this.state.user.vehicle === TRANSPORTATION_TYPES[0]['value'] &&
          <div className="form-row">
            <label htmlFor="car">Auto</label>
            <input
              id="car"
              type="text"
              value={this.state.user.car}
              name="car"
              onChange={this._setFieldValue}
            />
          </div>
          }

          {this.state.user.vehicle === TRANSPORTATION_TYPES[0]['value'] &&
          <div className="form-row">
            <label htmlFor="carColor">Farbe</label>
            <input
              id="carColor"
              type="text"
              value={this.state.user.carColor}
              name="carColor"
              onChange={this._setFieldValue}
            />
          </div>
          }

        </fieldset>

        {this.state.error &&
        <div className="error-message dark-red">
          Please fill in all fields.
        </div>
        }

        {this.state.view === VIEWS.SUCCESS &&
        <div>Your profile was updated successfully.</div>
        }

        <div className="form-row form-row--button-right">
          <button
            className='f6 link br3 ba ph3 pv2 mb2 dib white bg-blue'
            onClick={() => this._submit()}
          >
            Submit
          </button>
        </div>
      </div>
    )
  }

  /**
   * submit form
   * @private
   */
  _submit = async () => {

    let userData = Object.assign({}, this.state.user)

    if (formIsValid(userData, userSkipMandatoryFields)) {

      const userId = localStorage.getItem(GC_USER_ID)
      // add userId for the server to identify user
      userData = Object.assign(userData, {_id: userId})

      await this.props.updateUserMutation({
        variables: {
          user: userData
        },
        update: (store, { data: { updateUser } }) => {

          const variables = {userId}
          const data = store.readQuery({query: userQuery, variables})
          data.user = updateUser
          store.writeQuery({query: userQuery, variables, data})

          // show success message
          this.setState({view: VIEWS.SUCCESS})
          setTimeout(() => this.setState({view: null}), 3000)
        }
      })

    } else {
      this.setState({error: true})

    }
  }

  /**
   * check user props for not empty
   * @param ride
   * @returns {boolean}
   * @private
   */
  _formIsValid = (user) => {
    for (let prop in user) {
      let isMandatory = !userSkipMandatoryFields.includes(prop)

      if (isMandatory && !user[prop]) {
        return false
      }
    }
    return true
  }

  /**
   * set field value on state, reset error prop
   * @param evt
   * @private
   */
  _setFieldValue = (evt) => {
    let {name, value} = evt.target

    let newState = Object.assign({}, this.state, {error: null})
    newState['user'][name] = value
    this.setState(newState)
  }
}

export const userQuery = gql`
  query UserQuery($userId: ID!) {
    user(userId: $userId) {
      firstname
      lastname
      email
      yearOfBirth
      phone
      vehicle
      car
      carColor
      description
    }
  }
`

export const updateUserMutation = gql`
  mutation UpdateUserMutation($user: UserUpdateInput!) {
    updateUser(user: $user) {
      firstname
      lastname
      email
      yearOfBirth
      phone
      vehicle
      car
      carColor
      description
    }
  }  
`

export const UserProfileWithData = compose(
  graphql(userQuery, {
    options: (props) => {
      const userId = localStorage.getItem(GC_USER_ID)
      return {variables: {userId: userId || 0}}
    }
  }),
  graphql(updateUserMutation, {
    name: 'updateUserMutation'
  })
)(UserProfile)