import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'
import RideListFilter from './RideListFilter'

class RideListWithData extends Component {

  state = {
    filterData: {
      start: '',
      end: '',
      activity: ''
    }
  }

  componentDidMount() {
    this.props.data.refetch(this.state.filterData)
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
        <RideListFilter
          filterFunc={this._filter}
          start={this.state.filterData.start}
          end={this.state.filterData.end}
          activity={this.state.filterData.activity}
        />
        {this.props.data.rides.length === 0 &&
          <p>Sorry, your filter has no results.</p>
        }
        {this.props.data.rides.length > 0 &&
          <RideList rides={this.props.data.rides}/>
        }
      </div>
    )
  }

  _filter = ({start, end, activity}) => {
    this.setState({filterData: {
      start: start,
      end: end,
      activity: activity,
    }}, () => this.props.data.refetch(this.state.filterData))
  }
}

export const rideListQuery = gql`
  query RideListQuery($start: String, $end: String, $activity: String) {
    rides(start: $start, end: $end, activity: $activity) {
      id
      userId
      start
      end
      activity
      seats
      startDate
      returnInfo
    }
  }
`

export default graphql(rideListQuery, {options: {variables: {start: '', end: '', activity: ''}}})(RideListWithData)