import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from '../RideList'
import {GC_USER_ID} from '../../constants'

const UserRidesWithData = ({ data: {loading, error, myRides }}) => {

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
      _id
      start
      end
      activity
      price
      seats
      startDate
      returnInfo
      user {
        firstname
        lastname
        yearOfBirth
        description
      }
    }
  }
`;


export default graphql(myRidesQuery, {
  options: (props) => {
    const userId = localStorage.getItem(GC_USER_ID)
    return {variables: {userId}}
  }
})(UserRidesWithData)