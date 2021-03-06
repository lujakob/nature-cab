import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {VALIDATION} from '../../constants'
import {formIsValid, getYearOfBirthOptions} from '../utils/misc'
import {Logo} from '../components/Logo'
import {Helmet} from 'react-helmet'

const userSkipMandatoryFields = []

let defaultUser = {
  gender: '',
  firstname: '',
  lastname: '',
  email: '',
  yearOfBirth: '',
  password: ''
}

class RegisterPage extends Component {
  state = {
    user: Object.assign({}, defaultUser),
    error: null
  }

  render() {
    const {user, error} = this.state
    return (
      <div className="register-page page-wrapper">
        <Helmet bodyAttributes={{class: "is-login-page"}}/>

        <fieldset>
          <Logo/>

          <h2>
            Noch kein Mitglied?<br/>
            Jetzt kostenlos anmelden.
          </h2>
          <div className={'form-row ' + this._getErrorClass('gender')}>
            <input
              id="registration-gender-0"
              type="radio"
              value="male"
              name="gender"
              onChange={this._setFieldValue}
            />
            <label className="radio-label" htmlFor="registration-gender-0">Herr</label>
            <input
              id="registration-gender-1"
              type="radio"
              value="female"
              name="gender"
              onChange={this._setFieldValue}
            />
            <label className="radio-label" htmlFor="registration-gender-1">Frau</label>

          </div>
          <div className={'form-row ' + this._getErrorClass('firstname')}>
            <input
              type="text"
              placeholder="Vorname"
              value={user.firstname}
              name="firstname"
              onChange={this._setFieldValue}
            />
          </div>
          <div className={'form-row ' + this._getErrorClass('lastname')}>
            <input
              type="text"
              placeholder="Nachname"
              value={user.lastname}
              name="lastname"
              onChange={this._setFieldValue}
            />
          </div>

          <div className={'form-row ' + this._getErrorClass('email')}>
            <input
              type="text"
              placeholder="Email"
              value={user.email}
              name="email"
              onChange={this._setFieldValue}
            />
          </div>

          <div className={'form-row ' + this._getErrorClass('password')}>
            <input
              type="text"
              placeholder="Password"
              value={user.password}
              name="password"
              onChange={this._setFieldValue}
            />
          </div>

          <div className={'form-row ' + this._getErrorClass('yearOfBirth')}>
            <select
              onChange={this._setFieldValue}
              name="yearOfBirth"
            >
              <option value="">Geburtsjahr</option>
              {getYearOfBirthOptions().map((year, index) => {
                return <option key={index} value={year}>{year}</option>
              })}
            </select>
          </div>

          {error === VALIDATION.VALIDATION_REQUIRED &&
          <div className="form-row error-message dark-red">
            Bitte füllen Sie alle Felder aus.
          </div>
          }

          {error === VALIDATION.VALIDATION_EMAIL_UNIQUE &&
          <div className="form-row error-message dark-red">
            Diese Email ist schon registriert.
          </div>
          }

          <div className="form-row">
            <button
              className='link white bg-blue'
              onClick={() => this._submit()}
            >
              Registrieren
            </button>
            <div
              className='register-button pointer'
              onClick={() => this.props.history.push('/login')}
            >
              Login
            </div>
          </div>
        </fieldset>
      </div>
    )
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

  _submit = async () => {

    const {user} = this.state

    if (!formIsValid(user, userSkipMandatoryFields)) {
      this.setState({error: VALIDATION.VALIDATION_REQUIRED})
      return
    }

    let newUser = {
      gender: user.gender,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      yearOfBirth: user.yearOfBirth
    }

    await this.props.createUserMutation({
      variables: {user: newUser},
      update: (store, {data: {createUser}}) => {}
    })
    .then(() => {
      this.setState({user: defaultUser})
      this.props.history.push('/login')
    })
    .catch(err => {
      if (err.message.indexOf(VALIDATION.VALIDATION_EMAIL_UNIQUE) >= 0) {
        this.setState({error: VALIDATION.VALIDATION_EMAIL_UNIQUE})
      }
      console.log('error', err)
    })

  }

}

const CreateUserMutation = gql`
  mutation createUser($user: UserInput!) {
    createUser(user: $user) {
      gender
      firstname
      lastname
      email
      yearOfBirth
    }
  }
`

const withData = graphql(CreateUserMutation, {name: 'createUserMutation'})

export default withData(RegisterPage)