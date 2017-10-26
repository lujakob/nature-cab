import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'

const RideListWithData = ({ data: {loading, error, rides }}) => {

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <RideList rides={rides}/>
  )
};

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