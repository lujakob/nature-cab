import React from 'react'
import {GC_USER_ID, GC_AUTH_TOKEN} from '../constants'
import {emitter} from '../utils/emitter'
import {LayoutLeftCol} from './Layout/LayoutLeftCol'
import {Logo} from './Logo'
import FacebookLogin from 'react-facebook-login'

const LOGIN_ERRORS = {
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  EMPTY: 'EMPTY'
}

const FACEBOOK_APP_ID = 1953108001624740

class Login extends LayoutLeftCol {
  state = {
    email: '',
    password: '',
    error: '',
    facebookLoginLoading: false
  }

  render() {

    const token = localStorage.getItem(GC_AUTH_TOKEN)

    if (token) {
      return (
        <div className="login-page page-wrapper">
          <p>You are currently logged in.</p>
        </div>
      )
    }

    return (
      <div className="login-page page-wrapper">
        <fieldset>
          <Logo/>

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
              className='link ph3 pv2 white bg-blue'
              onClick={() => this._confirm()}
            >
              Login
            </button>
          </div>

          <div className="form-row">oder</div>

          <div className="form-row">
            {!this.state.facebookLoginLoading ? (
              <FacebookLogin
              cssClass="link ph3 pv2 white bg-blue"
              textButton="Login mit Facebook"
              appId={FACEBOOK_APP_ID}
              autoLoad={true}
              fields="name,first_name,last_name,email,picture"
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

        </fieldset>
      </div>
    )
  }

  _responseFacebook = (response) => {
    if (response && response.accessToken) {
      // const result = this._authenticateFacebook(response.accessToken)

    }
    console.log(response);
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

    if (result.message === 'ok') {
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
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }

  // request login
  async _authenticate () {
    const response = await fetch('http://localhost:4000/login', {
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
  async _authenticateFacebook (accessToken) {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'Application/JSON',
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({
        accessToken
      })
    })

    if (response.ok) {
      return await response.json()
    } else {
      return response
    }
  }
}

export default Login