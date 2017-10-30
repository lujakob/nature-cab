import React, {Component} from 'react'

class RideDetail extends Component {
  render() {
    return (
      <div>RideDetail {this.props.match.params.id}</div>
    )
  }
}

export default RideDetail