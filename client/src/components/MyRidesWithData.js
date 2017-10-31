import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from './RideList'
import {GC_USER_ID} from '../constants'

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
      start
      end
      activity
      seats
      startDate
      returnInfo
    }
  }
`;

const userId = localStorage.getItem(GC_USER_ID)

export default graphql(myRidesQuery, {options: {variables: {userId: parseInt(userId, 10)}}})(MyRidesWithData)