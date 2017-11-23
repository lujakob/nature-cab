import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'
import {truncateName} from '../utils/misc'
import {emitter} from '../utils/emitter'
import {Logo} from './Logo'

class Header extends Component {

  userId = null
  emitterToken = null

  componentWillMount() {
    this.emitterToken = emitter.addListener('loginSuccess', userId => {
      this.props.resetStore()
      this.props.data.refetch({userId})
    })
  }

  componentWillUnmount() {
    this.emitterToken.remove()
  }

  render() {
    const {data: {user, loading}} = this.props

    if (loading) {
      return '';
    }

    this.userId = localStorage.getItem(GC_USER_ID)

    return (
      <div className='header flex justify-between ph3'>
        <div className='flex flex-fixed black'>
          <div className='heading fw7 mr1'>
            <Logo/>
          </div>
        </div>

        <div className='flex flex-fixed'>
          {this.props.location.pathname !== "/create" &&
          <div className="flex flex-fixed mobile-hidden">
            <button
              className='link ph3 pv2 white'
              onClick={() => this._createRide()}
            >
              Fahrt anbieten
            </button>
          </div>
          }
          {this.userId ?
          <div className="flex flex-fixed mobile-hidden">
            {user &&
            <div className='flex'>
              <Link to='/user'  className='mr1 no-underline black'>{user.firstname} {truncateName(user.lastname)}</Link>
              <div>|</div>
            </div>
            }
            <div className='ml1 pointer' onClick={() => this._logout()}>Logout</div>
          </div>
          :
          <Link to='/login' className='ml1 no-underline login-link mobile-hidden'>Login</Link>
          }
        </div>
      </div>
    )
  }

  _createRide = () => {
    let uri = !!this.userId ? '/create' : '/login'
    this.props.history.push(uri)
  }

  _logout = () => {
    localStorage.removeItem(GC_USER_ID)
    localStorage.removeItem(GC_AUTH_TOKEN)
    this.props.history.push('/login')
    this.props.resetStore()
    this.props.data.user = null
  }

}

export const userQuery = gql`
  query UserQuery($userId: ID) {
    user(userId: $userId) {
      firstname
      lastname
    }
  }
`

export default graphql(userQuery, {
  options: (props) => {
    const userId = localStorage.getItem(GC_USER_ID)
    return {variables: {userId}}
  }
})(withRouter(Header))