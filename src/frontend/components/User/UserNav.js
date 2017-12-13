import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

export const userRoutes = [
  {pathname: '/user/profile', title:'Profil', activePath: '/user/profile'},
  {pathname: '/user/rides', title:'Meine Fahrten', activePath: '/user/ride'}
]

class UserNav extends Component {

  render() {

    return (
      <div className='user-nav'>
        <ul className="cf">
          {userRoutes.map((link, index) => (
            <li key={index} className={this._isActive(link.activePath) ? 'active' : ''}><Link to={link.pathname}>{link.title}</Link></li>
          ))}
        </ul>
      </div>
    )
  }

  _isActive(pathname) {
    return this.props.location.pathname.indexOf(pathname) >= 0
  }
}



export default withRouter(UserNav)