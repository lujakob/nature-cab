import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'
import RideListFilter from './RideListFilter'

let filterData = {
  start: '',
  end: ''
}

class RideListWithData extends Component {


  render() {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    return (
      <div>
        <RideListFilter filterFunc={this._filter} start={filterData.start} end={filterData.end}/>
        <RideList rides={this.props.data.rides}/>
      </div>
    )
  }

  _filter = (data) => {
    filterData = {
      start: data.start,
      end: data.end
    }

    this.props.data.refetch(filterData)
  }
}

export const rideListQuery = gql`
  query RideListQuery($start: String, $end: String) {
    rides(start: $start, end: $end) {
      id
      name
      start
      end
      activity
      seats
    }
  }
`;

export default graphql(rideListQuery)(RideListWithData)