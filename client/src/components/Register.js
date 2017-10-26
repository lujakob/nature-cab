import React, {Component} from 'react'
import {GC_USER_ID, GC_AUTH_TOKEN, STATUS_CODE} from '../constants'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    status: null
  }

  render() {
    return (
      <div>
        <h2>Register new user</h2>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={this.state.name}
            onChange={(evt) => this.setState({name: evt.target.value, status: null})}
          />
        </div>
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
          Please fill out all fields.
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

  _submit = async () => {

    if (!this.state.name || !this.state.email || !this.state.password) {
      this.setState({status: true})
      return
    }

    this.setState({name: '', email: '', password: '', status: null})
    this.props.history.push('/login')
  }

  _saveUserData = ({id, token}) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }

}

export default Register