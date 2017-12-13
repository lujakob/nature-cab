import React, {Component} from 'react'
import {GC_USER_ID, GC_AUTH_TOKEN} from '../../constants'
import {FACEBOOK_APP_ID, BASE_URL} from '../../config'
import {emitter} from '../utils/emitter'
import {Logo} from '../components/Logo'
import FacebookLogin from 'react-facebook-login'
import LocalStorage from '../utils/localStorage'
import {Helmet} from 'react-helmet'

const LOGIN_ERRORS = {
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  EMPTY: 'EMPTY'
}

const isProduction = process.env.NODE_ENV === 'production'

const PORT =
  process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000

const API_URL =
  isProduction
    ? BASE_URL
    : 'http://localhost:' + PORT

const loginUrl = `${API_URL}/login`

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    facebookLoginLoading: false
  }

  render() {

    const isLoggedIn = LocalStorage.getItem(GC_AUTH_TOKEN)

    return (
      <div className="login-page page-wrapper">
        <Helmet bodyAttributes={{class: 'is-login-page'}}/>
        <fieldset>
          <Logo/>
          {isLoggedIn
            ? (
              <p>You are currently logged in.</p>
            ) : (
              <div>

                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={(evt) => this.setState({email: evt.target.value, error: null})}
                  />
                </div>
                <div className="form-row">
                  <input
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={(evt) => this.setState({password: evt.target.value, error: null})}
                  />
                </div>

                {this.state.error &&
                <div className="error-message dark-red">
                  {this._getLoginErrorMessage(this.state.error)}
                </div>
                }

                <div className="form-row">
                  <button
                    className='link white bg-blue'
                    onClick={() => this._confirm()}
                  >
                    Login
                  </button>
                </div>

                <div className="form-row">oder</div>

                <div className="form-row">
                  {!this.state.facebookLoginLoading ? (
                    <FacebookLogin
                      cssClass="link white bg-blue"
                      textButton="Login mit Facebook"
                      appId={FACEBOOK_APP_ID}
                      scope="user_birthday"
                      fields="name,first_name,last_name,email,picture,birthday,gender"
                      callback={this._responseFacebook} />
                  ) : (
                    <p>Loading...</p>
                  ) }

                </div>

                <div className="form-row">
                  Du hast kein Konto?&nbsp;
                  <span
                    className='register-button pointer'
                    onClick={() => this.props.history.push('/register')}
                  >
                    Anmelden
                  </span>
                </div>
              </div>
            )
          }
        </fieldset>
      </div>
    )
  }

  _responseFacebook = async (response) => {

    if (response && response.accessToken) {
      const result = await this._authenticateFacebook(response)
      this._loginResult(result)
    }
  }

  /**
   * _getLoginErrorMessage - return error message depending on status code
   * @returns {*}
   * @private
   */
  _getLoginErrorMessage(error) {
    switch(error) {
      case LOGIN_ERRORS.EMPTY:
        return 'Bitte Email und Passwort ausfüllen.'

      case LOGIN_ERRORS.UNAUTHORIZED:
        return 'Email oder Passwort falsch.'

      case LOGIN_ERRORS.EMAIL_NOT_FOUND:
        return 'Diese Email ist nicht registriert.'

      default:
        return ''
    }
  }

  /**
   * _confirm - do login request,
   * @private
   */
  _confirm = async () => {

    // empty fields validation
    if (!this.state.email || !this.state.password) {
      this.setState({error: LOGIN_ERRORS.EMPTY})
      return
    }

    let result = await this._authenticate()
    this._loginResult(result)
  }

  _loginResult = async (result) => {

    if (result.message === 'OK') {
      this._saveUserData(result)

      // emit login success to display username in header
      emitter.emit('loginSuccess', result.id)

      // reset form fields
      this.setState({email: '', password: ''})
      // redirect to home
      this.props.history.push({pathname: '/', from: 'login'})

    } else if (result.status === 401) {
      const data = await result.json()
      this.setState({error: data.message})

    } else {
      throw new Error('Login failed')
    }
  }

  /**
   * _saveUserData - saves in local storage
   * @param id
   * @param token
   * @private
   */
  _saveUserData = ({id, token}) => {
    LocalStorage.setItem(GC_USER_ID, id)
    LocalStorage.setItem(GC_AUTH_TOKEN, token)
  }

  // request login
  async _authenticate () {
    const response = await fetch(loginUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'Application/JSON',
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })

    if (response.ok) {
      return await response.json()
    } else {
      return response
    }
  }

  // request login
  async _authenticateFacebook (data) {
    const {accessToken} = data
    const user = this._getFacebookUserData(data)
    const response = await fetch(loginUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'Application/JSON',
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({
        accessToken,
        user
      })
    })

    if (response.ok) {
      return await response.json()
    } else {
      return response
    }
  }


  _getFacebookUserData(data) {
    let {email, first_name: firstname, last_name: lastname, userID: facebookUserId, picture, birthday, gender} = data
    picture = picture && picture.data && picture.data.url ? picture.data.url : ''
    let yearOfBirth = !!birthday ? (new Date(birthday).getFullYear()).toString() : ''

    return {email, firstname, lastname, facebookUserId, picture, gender, yearOfBirth}

  }
}

export default LoginPage