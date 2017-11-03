"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
class RideDetail extends react_1.Component {
    render() {
        return (react_1.default.createElement("div", null,
            "RideDetail ",
            this.props.match.params.id));
    }
}
exports.default = RideDetail;
//# sourceMappingURL=RideDetail.js.map