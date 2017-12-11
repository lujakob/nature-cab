import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

export const userRoutes = [
  {pathname: '/user/profile', title:'Profil'},
  {pathname: '/user/rides', title:'Meine Fahrten'}
]

class UserNav extends Component {

  render() {

    return (
      <div className='user-nav'>
        <ul className="cf">
          {userRoutes.map((link, index) => (
            <li key={index} className={this._isActive(link.pathname) ? 'active' : ''}><Link to={link.pathname}>{link.title}</Link></li>
          ))}
        </ul>
      </div>
    )
  }

  _isActive(pathname) {
    return this.props.location.pathname === pathname
  }
}



export default withRouter(UserNav)