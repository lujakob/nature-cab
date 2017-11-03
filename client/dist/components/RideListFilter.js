"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const constants_1 = require("../constants");
class RideListFilter extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            start: this.props.start ? this.props.start : '',
            end: this.props.end ? this.props.end : '',
            activity: this.props.activity ? this.props.activity : '',
        };
        this._onChange = (evt) => {
            this.setState({ [evt.target.name]: evt.target.value });
        };
        this._filter = () => {
            this.props.filterFunc(this.state);
        };
    }
    render() {
        return (react_1.default.createElement("div", { className: "ride-list-filter" },
            react_1.default.createElement("div", { className: "ride-list-filter-field" },
                react_1.default.createElement("input", { type: "text", placeholder: "Start", value: this.state.start, name: "start", onChange: this._onChange })),
            react_1.default.createElement("div", { className: "ride-list-filter-field" },
                react_1.default.createElement("input", { type: "text", placeholder: "End", value: this.state.end, name: "end", onChange: this._onChange })),
            react_1.default.createElement("div", { className: "ride-list-filter-field" },
                react_1.default.createElement("select", { onChange: this._onChange, value: this.state.activity, name: "activity" }, Object.keys(constants_1.ACTIVITIES).map((activity, index) => {
                    return react_1.default.createElement("option", { key: index, value: activity }, activity);
                }))),
            react_1.default.createElement("div", { className: "ride-list-filter-field" },
                react_1.default.createElement("div", { className: 'pointer mr2 button', onClick: this._filter }, " Filter"))));
    }
}
exports.default = RideListFilter;
//# sourceMappingURL=RideListFilter.js.map