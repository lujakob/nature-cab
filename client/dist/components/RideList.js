"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const moment_1 = require("moment");
require("moment/locale/de");
class RideList extends react_1.Component {
    render() {
        return (react_1.default.createElement("div", { className: "ride-list" }, this.props.rides && this.props.rides.map((ride, index) => (react_1.default.createElement("div", { className: "ride-item", key: index, index: index },
            react_1.default.createElement("div", { className: "fl w-20" },
                react_1.default.createElement(react_router_dom_1.Link, { to: `/ride/${ride.id}` }, ride.start)),
            react_1.default.createElement("div", { className: "fl w-20" },
                react_1.default.createElement(react_router_dom_1.Link, { to: `/ride/${ride.id}` }, ride.end)),
            react_1.default.createElement("div", { className: "fl w-20" }, moment_1.default(new Date(ride.startDate)).format('D.M.Y')),
            react_1.default.createElement("div", { className: "fl w-20" },
                moment_1.default(new Date(ride.startDate)).format('kk:mm'),
                " Uhr"),
            react_1.default.createElement("div", { className: "fl w-20" }, ride.activity))))));
    }
}
;
exports.default = RideList;
//# sourceMappingURL=RideList.js.map