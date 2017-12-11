import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'
import {truncateName} from '../utils/misc'
import {emitter} from '../utils/emitter'
import {Logo} from './Logo'
import LocalStorage from '../utils/localStorage'

import {userRoutes} from './User/UserNav'

class Header extends Component {

  userId = null
  emitterToken = null

  constructor(props) {
    super(props)
    this.state = {
      mobileMenuIsVisible: false,
      searchIsVisible: false
    }
  }

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
    const {data: {user}} = this.props

    this.userId = LocalStorage.getItem(GC_USER_ID)

    return (
      <div className='header flex justify-between ph3'>
        <div className='flex flex-fixed black'>
          <div className='heading fw7 mr1'>
            <Logo/>
          </div>
        </div>

        <div className='flex flex-fixed'>
          {this.props.location.pathname !== '/create' &&
          <div className="flex flex-fixed mobile-hidden">
            <button
              className='link white main-button'
              onClick={() => this._createRide()}
            >
              Fahrt anbieten
            </button>
          </div>
          }
          <div className="flex flex-fixed mobile-hidden">
            {user ? (
              <div className='flex'>
                <Link to='/user'  className='mr1 no-underline black'>{user.firstname} {truncateName(user.lastname)}</Link>
                <div>|</div>
                <div className='ml1 pointer' onClick={() => this._logout()}>Logout</div>
              </div>
            ) : (
              <Link to='/login' className='ml1 no-underline login-link mobile-hidden'>Login</Link>
              )
            }
          </div>
          <div className="burger-mobile-button-container flex flex-fixed">
            <div className="flex burger-mobile-button">
              <button
                className={'button-toggle hamburger ' + (this.state.mobileMenuIsVisible ? 'is-hidden' : '')}
                onClick={this._toggleMobileMenu}>
                &#9776;
              </button>
              <button
                className={'button-toggle cross ' + (!this.state.mobileMenuIsVisible ? 'is-hidden' : '')}
                onClick={this._toggleMobileMenu}>
                &#735;
              </button>
            </div>
          </div>
        </div>
        <div className={'menu-mobile ' + (!this.state.mobileMenuIsVisible ? 'is-hidden' : '')}>
          <ul>
            <li onClick={this._closeMenu}><Link to='/create' className=''>Fahrt anlegen</Link></li>

            {user && userRoutes.map((el, key) => (
              <li key={key} onClick={this._closeMenu}><Link to={el.pathname} className=''>{el.title}</Link></li>
            ))}

            {this.userId
              ? <li><a onClick={() => this._logout()}>Logout</a></li>
              : <li><Link to='/login' className=''>Login</Link></li>
            }
          </ul>
        </div>
      </div>
    )
  }

  _closeMenu = () => {
    this.setState({mobileMenuIsVisible: false})
  }

  _toggleMobileMenu = () => {
    this.setState({mobileMenuIsVisible: !this.state.mobileMenuIsVisible})
  }

  _createRide = () => {
    let uri = !!this.userId ? '/create' : '/login'
    this.props.history.push(uri)
  }

  _logout = () => {
    LocalStorage.removeItem(GC_USER_ID)
    LocalStorage.removeItem(GC_AUTH_TOKEN)
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

const withData = graphql(userQuery, {
  options: (props) => {
    const userId = LocalStorage.getItem(GC_USER_ID)
    return {variables: {userId}}
  }
})

export default withData(withRouter(Header))