import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag';

const RideList = ({ data: {loading, error, rides }}) => {

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="ride-list">
      {rides.map((ride, index) => (
        <div className="ride-item" key={index} index={index}>
          <div className="fl w-20">{ride.start}</div>
          <div className="fl w-20">{ride.end}</div>
          <div className="fl w-20">{ride.seats}</div>
          <div className="fl w-20">{ride.activity}</div>
          <div className="fl w-20">{ride.name}</div>
        </div>
      ))
      }
    </div>
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

export default graphql(rideListQuery)(RideList)