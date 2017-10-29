import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'
import RideListFilter from './RideListFilter'

class RideListWithData extends Component {

  filterData = {
    start: '',
    end: ''
  }

  render() {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    return (
      <div>
        <RideListFilter filterFunc={this._filter} />
        <RideList rides={this.props.data.rides}/>
      </div>
    )
  }

  _filter = (data) => {
    this.filterData = {
      start: data.start,
      end: data.end
    }
    console.log(this.filterData)
  }
}

export const rideListQuery = gql`
  query RideListQuery {
    rides {
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