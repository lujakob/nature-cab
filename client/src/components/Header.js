import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'

class Header extends Component {

  userId = null

  render() {
    this.userId = localStorage.getItem(GC_USER_ID)

    return (
      <div className='header flex justify-between nowrap ph3'>
        <div className='flex flex-fixed black'>
          <div className='heading fw7 mr1'>
            <Link to='/ridelist' className='ml1 no-underline black'>NatureCab</Link>
          </div>
          {this.userId &&
          <div className='flex'>
            <div className='ml1'>|</div>
            <Link to='/myrides'  className='ml1 no-underline black'>my rides</Link>
          </div>
          }
        </div>

        <div className='flex flex-fixed'>
          {this.props.location.pathname !== "/create" &&
          <div className="flex flex-fixed">
            <button
              className='f6 link br3 ba ph3 pv2 mb2 dib white bg-blue'
              onClick={() => this._createRide()}
            >
              Fahrt anbieten
            </button>
          </div>
          }
          {this.userId ?
          <div className="flex flex-fixed">
            <div className='flex'>
              <Link to='/profile'  className='mr1 no-underline black'>my profile</Link>
              <div>|</div>
            </div>
            <div className='ml1 pointer' onClick={() => this._logout()}>Logout</div>
          </div>
          :
          <Link to='/login' className='ml1 no-underline login-link'>Login</Link>
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
  }

}

export default withRouter(Header)