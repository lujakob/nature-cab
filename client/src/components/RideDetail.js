import React, {Component} from 'react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import moment from 'moment'
import 'moment/locale/de'

class RideDetail extends Component {

  render() {

    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    return (
      <div>
        <div className="trip-details">{this.props.data.ride.start}</div>
        RideDetail {this.props.match.params.id}
        {console.log(this.props.data.ride)}
      </div>
    )
  }
}

const RideDetailQuery = gql`
  query RideDetail($id:ID!) {
    ride(id: $id) {
      start
      end
    }
  }
`


export default graphql(RideDetailQuery, {
  options: (props) => ({
    variables: {id: props.match.params.id}
  })
})(RideDetail)