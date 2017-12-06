import {Component} from 'react'

/**
 * this class is used to add/remove css class "is-login-page" on the body
 * ! lifecycle hooks of this class can be overwritten by child classes
 */
export class LayoutLeftCol extends Component {

  componentDidMount() {
    document.body.classList.add('is-login-page')
  }
  componentWillUnmount() {
    document.body.classList.remove('is-login-page')
  }
}