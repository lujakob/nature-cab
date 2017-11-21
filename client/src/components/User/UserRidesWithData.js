import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';
import RideList from '../Ride/RideList'
import {GC_USER_ID} from '../../constants'

const UserRidesWithData = ({ data: {loading, error, myRides }}) => {

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <RideList rides={myRides} detailLinkPrefix="/user/rides/"/>
  )
};

export const myRidesQuery = gql`
  query MyRidesQuery($userId: ID!) {
    myRides(userId: $userId) {
      _id
      startLocation
      startCity
      endLocation
      endCity
      activity
      seats
      price
      startDate
      returnInfo
      user {
        firstname
        lastname
        yearOfBirth
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