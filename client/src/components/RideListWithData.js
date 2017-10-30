import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'
import RideListFilter from './RideListFilter'


class RideListWithData extends Component {

  state = {
    filterData: {
      start: '',
      end: ''
    }
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
        <RideListFilter filterFunc={this._filter} start={this.state.filterData.start} end={this.state.filterData.end}/>
        <RideList rides={this.props.data.rides}/>
      </div>
    )
  }

  _filter = ({start, end}) => {
    this.setState({filterData: {
      start: start,
      end: end
    }}, () => this.props.data.refetch(this.state.filterData))
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