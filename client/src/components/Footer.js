import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <ul>
          <li>
            <Link to="/ueber-naturecab">&Uuml;ber NatureCab</Link>
          </li>
          <li>
            <Link to="/wie-es-funktioniert">Wie es funktioniert</Link>
          </li>
          <li>
            <Link to="/impressum">Impressum</Link>
          </li>
          <li>
            <Link to="/agb">AGB</Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default Footer