import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'

class Header extends Component {

  render() {
    const userId = localStorage.getItem(GC_USER_ID)

    return (
      <div className='flex pa1 justify-between nowrap'>
        <div className='flex flex-fixed black'>
          <div className='fw7 mr1'>Nature Cab</div>
          {userId &&
          <div className="flex">
            <Link to='/create' className='ml1 no-underline black'>new</Link>
          </div>
          }
          <div className='flex'>
            <div className='ml1'>|</div>
            <Link to='/ridelist' className='ml1 no-underline black'>ride list</Link>
          </div>

          {userId &&
          <div className='flex'>
            <div className='ml1'>|</div>
            <Link to='/myrides'  className='ml1 no-underline black'>my rides</Link>
          </div>
          }
        </div>

        {userId ?
          <div className='flex flex-fixed'>
            <div className='flex'>
              <Link to='/profile'  className='mr1 no-underline black'>my profile</Link>
              <div>|</div>
            </div>
            <div className='ml1 pointer black' onClick={() => this._logout()}>logout</div>
          </div>
          :
          <div className='flex flex-fixed'>
            <Link to='/login' className='ml1 no-underline black'>login</Link>
          </div>
        }

      </div>
    )
  }

  _logout = () => {
    localStorage.removeItem(GC_USER_ID)
    localStorage.removeItem(GC_AUTH_TOKEN)
    this.props.history.push('/login')
  }

}

export default withRouter(Header)