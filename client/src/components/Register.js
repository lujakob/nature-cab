import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

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

    let newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }

    await this.props.createUserMutation({
      variables: {user: newUser},
      update: (store, {data: {createUser}}) => {}
    })

    this.setState({name: '', email: '', password: '', status: null})
    this.props.history.push('/login')
  }

}

const CreateUserMutation = gql`
  mutation createUser($user: UserInput!) {
    createUser(user: $user) {
      name
      email
      password
    }
  }
`

export default graphql(CreateUserMutation, {name: 'createUserMutation'})(Register)