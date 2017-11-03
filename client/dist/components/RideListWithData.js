"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_apollo_1 = require("react-apollo");
const gql = require("graphql-tag");
const RideList = require("./RideList");
const RideListFilter = require("./RideListFilter");
class RideListWithData extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            filterData: {
                start: '',
                end: '',
                activity: ''
            }
        };
        this._filter = ({ start, end, activity }) => {
            this.setState({ filterData: {
                    start: start,
                    end: end,
                    activity: activity,
                } }, () => this.props.data.refetch(this.state.filterData));
        };
    }
    componentDidMount() {
        this.props.data.refetch(this.state.filterData);
    }
    render() {
        if (this.props.data.loading) {
            return React.createElement("p", null, "Loading ...");
        }
        if (this.props.data.error) {
            return React.createElement("p", null, this.props.data.error.message);
        }
        return (React.createElement("div", null,
            React.createElement(RideListFilter, { filterFunc: this._filter, start: this.state.filterData.start, end: this.state.filterData.end, activity: this.state.filterData.activity }),
            this.props.data.rides.length === 0 &&
                React.createElement("p", null, "Sorry, your filter has no results."),
            this.props.data.rides.length > 0 &&
                React.createElement(RideList, { rides: this.props.data.rides })));
    }
}
exports.rideListQuery = gql `
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
`;
exports.default = react_apollo_1.graphql(exports.rideListQuery, { options: { variables: { start: '', end: '', activity: '' } } })(RideListWithData);
//# sourceMappingURL=RideListWithData.js.map