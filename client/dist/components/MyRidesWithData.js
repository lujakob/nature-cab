"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const gql = require("graphql-tag");
const RideList = require("./RideList");
const MyRidesWithData = ({ data: { loading, error, myRides } }) => {
    if (loading) {
        return React.createElement("p", null, "Loading ...");
    }
    if (error) {
        return React.createElement("p", null, error.message);
    }
    return (React.createElement(RideList, { rides: myRides }));
};
exports.myRidesQuery = gql `
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
const userId = (React.createElement("any", null,
    "window).localStorage.getItem(GC_USER_ID) export const widthData = graphql",
    React.createElement(Response, null, "(myRidesQuery)(MyRidesWithData)")));
//# sourceMappingURL=MyRidesWithData.js.map