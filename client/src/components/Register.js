import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {VALIDATION} from '../constants'
import {formIsValid, getYearOfBirthOptions} from '../utils/misc'
import {LayoutLeftCol} from './Layout/LayoutLeftCol'
import {Logo} from './Logo'

const userSkipMandatoryFields = ['status']

let stateDefaults = {
  gender: '',
  firstname: '',
  lastname: '',
  email: '',
  yearOfBirth: '',
  password: '',
  status: null
}

class Register extends LayoutLeftCol {
  state = Object.assign({}, stateDefaults)

  render() {
    return (
      <div className="register-page page-wrapper">

        <fieldset>
          <Logo/>

          <h2>
            Noch kein Mitglied?<br/>
            Jetzt kostenlos anmelden.
          </h2>
          <div className="form-row">
            <input
              id="registration-gender-0"
              type="radio"
              value="male"
              name="gender"
              onChange={(evt) => this.setState({gender: evt.target.value, status: null})}
            />
            <label className="radio-label" htmlFor="registration-gender-0">Herr</label>
            <input
              id="registration-gender-1"
              type="radio"
              value="female"
              name="gender"
              onChange={(evt) => this.setState({gender: evt.target.value, status: null})}
            />
            <label className="radio-label" htmlFor="registration-gender-1">Frau</label>

          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Vorname"
              value={this.state.firstname}
              onChange={(evt) => this.setState({firstname: evt.target.value, status: null})}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Nachname"
              value={this.state.lastname}
              onChange={(evt) => this.setState({lastname: evt.target.value, status: null})}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Email"
              value={this.state.email}
              onChange={(evt) => this.setState({email: evt.target.value, status: null})}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Password"
              value={this.state.password}
              onChange={(evt) => this.setState({password: evt.target.value, status: null})}
            />
          </div>

          <div className="form-row">
            <select
              onChange={(evt) => this.setState({yearOfBirth: evt.target.value, status: null})}
              name="activity"
            >
              <option value="">Geburtsjahr</option>
              {getYearOfBirthOptions().map((year, index) => {
                return <option key={index} value={year}>{year}</option>
              })}
            </select>
          </div>

          <div className="form-row form-row--button-right">
            <button
              className='f6 link br3 ba ph3 pv2 mb2 dib white bg-blue'
              onClick={() => this._submit()}
            >
              Registrieren
            </button>
          </div>
        </fieldset>

        {this.state.status === VALIDATION.VALIDATION_REQUIRED &&
        <div className="error-message dark-red">
          Bitte füllen Sie alle Felder aus.
        </div>
        }

        {this.state.status === VALIDATION.VALIDATION_EMAIL_UNIQUE &&
        <div className="error-message dark-red">
          Diese Email ist schon registriert.
        </div>
        }
      </div>
    )
  }

  _submit = async () => {

    if (!formIsValid(this.state, userSkipMandatoryFields)) {
      this.setState({status: VALIDATION.VALIDATION_REQUIRED})
      return
    }

    let newUser = {
      gender: this.state.gender,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      password: this.state.password,
      yearOfBirth: this.state.yearOfBirth
    }

    await this.props.createUserMutation({
      variables: {user: newUser},
      update: (store, {data: {createUser}}) => {}
    })
    .then(() => {
      this.setState(stateDefaults)
      this.props.history.push('/login')
    })
    .catch(err => {
      if (err.message.indexOf(VALIDATION.VALIDATION_EMAIL_UNIQUE) >= 0) {
        this.setState({status: VALIDATION.VALIDATION_EMAIL_UNIQUE})
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

export default graphql(CreateUserMutation, {name: 'createUserMutation'})(Register)