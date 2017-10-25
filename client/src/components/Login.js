import React, {Component} from 'react'
import {GC_USER_ID, GC_AUTH_TOKEN, STATUS_CODE} from '../constants'

class Login extends Component {
  state = {
    email: '',
    password: '',
    status: null
  }

  render() {
    return (
      <div>
        <div>
          <input
            type="text"
            placeholder="Email"
            value={this.state.email}
            onChange={(evt) => this.setState({email: evt.target.value, status: null})}
          />
        </div>
        <div>
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

        <div>
          <div
            className='pointer mr2 button'
            onClick={() => this._confirm()}
          >
            Login
          </div>
        </div>
        <p>{this.state.email}</p>
      </div>

    )
  }

  _confirm = async () => {

    let result = await this.fetchAsync()

    if (result.status && result.status === STATUS_CODE.UNAUTHORIZED) {
      this.setState({status: STATUS_CODE.UNAUTHORIZED})
    } else {
      this._saveUserData(result)
      this.props.history.push(`/rides`)
    }

    this.setState({email: '', password: ''})
  }

  _saveUserData = ({id, token}) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }

  async fetchAsync () {
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
      return response;
    }


  }
}

export default Login