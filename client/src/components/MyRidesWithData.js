import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'

const MyRidesWithData = ({ data: {loading, error, myRides }}) => {

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <RideList rides={myRides}/>
  )
};

export const myRidesQuery = gql`
  query MyRidesQuery($userId: ID!) {
    myRides(userId: $userId) {
      id
      name
      start
      end
      activity
      seats
    }
  }
`;

export default graphql(myRidesQuery, {options: {variables: {userId: 1}}})(MyRidesWithData)