import React, {Component} from 'react'
import {GC_USER_ID, GC_AUTH_TOKEN, STATUS_CODE} from '../constants'

class Login extends Component {
  state = {
    email: '',
    password: '',
    status: null
  }

  render() {

    const token = localStorage.getItem(GC_AUTH_TOKEN)

    if (token) {
      return (
        <div className="login">
          You are currently logged in.
        </div>
      )
    }

    return (
      <div className="login">
        <fieldset>
          <h3>Login</h3>
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
          {this.state.status &&
          <div className="error-message dark-red">
            Please check email and password to try again.
          </div>
          }

          <div className="form-row mb0">
            <button
              className='f6 link br3 ba ph3 pv2 mb2 dib white bg-blue'
              onClick={() => this._confirm()}
            >
              Login
            </button>
          </div>
          <div>
            <div
              className='pointer mr2 button'
              onClick={() => this.props.history.push('/register')}
            >
              Anmelden
            </div>
          </div>
        </fieldset>
      </div>
    )
  }

  /**
   * _confirm - do login request,
   * @private
   */
  _confirm = async () => {

    // return if fields are empty
    if (!this.state.email || !this.state.password) {
      this.setState({status: true})
      return
    }

    let result = await this._authenticate()

    // reset form fields
    this.setState({email: '', password: ''})

    if (result.message === 'ok') {
      this._saveUserData(result)
      // emitter.emit('loginSuccess', result.id)
      this.props.history.push({pathname: '/rides', from: 'login'})

    } else if (result.status && result.status === STATUS_CODE.UNAUTHORIZED) {
      this.setState({status: STATUS_CODE.UNAUTHORIZED})

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
}

export default Login