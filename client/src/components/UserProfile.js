import React, {Component} from 'react'
import {GC_USER_ID} from '../constants'
import gql from 'graphql-tag'
import {graphql, compose} from 'react-apollo'

const userSkipMandatoryFields = ['email']

const VIEWS = {SUCCESS: 'SUCCESS'}

const userId = localStorage.getItem(GC_USER_ID)

class UserProfile extends Component {

  state = {
    user: {
      userId: localStorage.getItem(GC_USER_ID),
      name: '',
      email: ''
    },
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
          name: nextProps.data.user.name,
          email: nextProps.data.user.email
        }})
      this.setState(newState)
    }

  }

  render() {

    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    return (
      <div>
        <fieldset className="form-fieldset">
          <h3>Deine persönlichen Daten</h3>

          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              value={this.state.user.name}
              name="name"
              onChange={this._setFieldValue}
            />
          </div>
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

    let userData = this._buildUser()

    if (this._formIsValid(userData)) {

      // add userId for the server to identify user
      userData = Object.assign(userData, {userId})

      await this.props.updateUserMutation({
        variables: {
          user: userData
        },
        update: (store, { data: { updateUser } }) => {
          // show success message
          this.setState({view: VIEWS.SUCCESS})
        }
      })

    } else {
      this.setState({error: true})
    }
  }

  _buildUser() {
    return {
      name: this.state.user.name,
      email: this.state.user.email
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
      name
      email
    }
  }
`

export const updateUserMutation = gql`
  mutation UpdateUserMutation($user: UserUpdateInput!) {
    updateUser(user: $user) {
      name
      email
    }
  }  
`

export const UserProfileWithData = compose(
  graphql(userQuery, {
    options: {variables: {userId}}
  }),
  graphql(updateUserMutation, {
    name: 'updateUserMutation'
  })
)(UserProfile)