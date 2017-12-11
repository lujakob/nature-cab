import React, {Component} from 'react'
import {GC_USER_ID} from '../../constants'
import gql from 'graphql-tag'
import {graphql, compose} from 'react-apollo'
import {formIsValid, getYearOfBirthOptions} from '../../utils/misc'
import LocalStorage from '../../utils/localStorage'

// these fields will be skipped in 'required' validation
const userSkipMandatoryFields = ['phone', 'carType', 'carColor', 'description']

const VIEWS = {SUCCESS: 'SUCCESS'}

const defaultUser = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  yearOfBirth: '',
  carType: '',
  carColor: '',
  description: ''
}

class UserProfilePage extends Component {

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
    if (nextProps.data.user) {
      const newState = Object.assign({}, this.state, {
        user: {
          firstname: nextProps.data.user.firstname,
          lastname: nextProps.data.user.lastname,
          email: nextProps.data.user.email,
          phone: nextProps.data.user.phone,
          yearOfBirth: nextProps.data.user.yearOfBirth,
          carType: nextProps.data.user.carType,
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
      <div className="content-max-width">
        <fieldset className="form-fieldset">
          <h3>Deine persönlichen Daten</h3>

          <div className={'form-row ' + this._getErrorClass('firstname')}>
            <label htmlFor="firstname">Vorname</label>
            <input
              id="firstname"
              type="text"
              value={this.state.user.firstname}
              name="firstname"
              onChange={this._setFieldValue}
            />
          </div>

          <div className={'form-row ' + this._getErrorClass('lastname')}>
            <label htmlFor="lastname">Nachname</label>
            <input
              id="lastname"
              type="text"
              value={this.state.user.lastname}
              name="lastname"
              onChange={this._setFieldValue}
            />
          </div>

          <div className={'form-row ' + this._getErrorClass('email')}>
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

          <div className={'form-row ' + this._getErrorClass('yearOfBirth')}>
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
            <label htmlFor="carType">Model</label>
            <input
              id="carType"
              type="text"
              value={this.state.user.carType}
              name="carType"
              onChange={this._setFieldValue}
            />
          </div>

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
        </fieldset>

        {this.state.error &&
        <div className="error-message dark-red">
          Bitte füllen Sie alle Felder aus.
        </div>
        }

        {this.state.view === VIEWS.SUCCESS &&
        <div>Ihr Profil wurde erfolgreich gespeichert.</div>
        }

        <div className="form-row form-row--button-right">
          <button
            className='link white bg-blue'
            onClick={() => this._submit()}
          >
            Speichern
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

      const userId = LocalStorage.getItem(GC_USER_ID)
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

  _getErrorClass(field) {
    return this.state.error && !this.state.user[field] ? 'is-error' : ''
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
      carType
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
      carType
      carColor
      description
    }
  }  
`

export const withData = compose(
  graphql(userQuery, {
    options: (props) => {
      const userId = LocalStorage.getItem(GC_USER_ID)
      return {variables: {userId: userId || 0}}
    }
  }),
  graphql(updateUserMutation, {
    name: 'updateUserMutation'
  })
)

export default withData(UserProfilePage)