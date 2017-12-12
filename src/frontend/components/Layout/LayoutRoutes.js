import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import {GC_AUTH_TOKEN} from '../../constants'
import {GOOGLE_KEYS, isProduction, defaultPageTitle} from '../../../config'

import UeberNatureCabPage from '../../pages/UeberNatureCab'
import RidesPage from '../../pages/RidesPage'
import CreateRidePage from '../../pages/CreateRidePage'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import UserPage from '../../pages/user/UserPage'
import NoMatch404Page from '../../pages/NoMatch404Page'
import HomePage from '../../pages/HomePage'
import LayoutBase from './LayoutBase'
import {Helmet} from 'react-helmet'

import LocalStorage from '../../utils/localStorage'

const ReactGA = process.browser ? require('react-ga') : {}

if (isProduction && process.browser) {
  ReactGA.initialize(GOOGLE_KEYS.ANALYTICS)
}

const gaLogPageView = () => {

  if (isProduction && process.browser) {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }

  return null;
}

// dynamically setting "helmet" head tags is nested, hence the defaults are set here in the layout
export default ({client}) => {
  return (
    <div>
      <Helmet>
        <title>{defaultPageTitle}</title>
      </Helmet>
      <Route path='/' component={gaLogPageView} />
      <Switch>
        <Route exact path='/login' component={LoginPage}/>
        <Route exact path='/register' component={RegisterPage}/>
        <LayoutBase client={client}>
          <Switch>
            <Route exact path='/' component={HomePage}/>
            <Route path='/rides' component={RidesPage}/>
            <ProtectedRoute exact path='/create' component={CreateRidePage}/>
            <ProtectedRoute path='/user' component={UserPage}/>
            <ProtectedRoute path='/ueber-naturecab' component={UeberNatureCabPage}/>
            <Route exact path="/404" component={NoMatch404Page}/>
            <Redirect to="/404"/>
          </Switch>
        </LayoutBase>
      </Switch>
    </div>
  )
}

const ProtectedRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => {
    const token = LocalStorage.getItem(GC_AUTH_TOKEN)
    return token
      ? <Component {...props}/>
      : <Redirect to={{pathname:'/login'}}/>
  }}/>
)