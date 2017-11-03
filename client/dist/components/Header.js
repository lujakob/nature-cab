"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_router_1 = require("react-router");
const constants_1 = require("../constants");
class Header extends react_1.Component {
    render() {
        const userId = localStorage.getItem(constants_1.GC_USER_ID);
        return (react_1.default.createElement("div", { className: 'flex pa1 justify-between nowrap orange' },
            react_1.default.createElement("div", { className: 'flex flex-fixed black' },
                react_1.default.createElement("div", { className: 'fw7 mr1' }, "Nature Cab"),
                userId &&
                    react_1.default.createElement("div", { className: "flex" },
                        react_1.default.createElement(react_router_dom_1.Link, { to: '/create', className: 'ml1 no-underline black' }, "new")),
                react_1.default.createElement("div", { className: 'flex' },
                    react_1.default.createElement("div", { className: 'ml1' }, "|"),
                    react_1.default.createElement(react_router_dom_1.Link, { to: '/ridelist', className: 'ml1 no-underline black' }, "ride list")),
                userId &&
                    react_1.default.createElement("div", { className: 'flex' },
                        react_1.default.createElement("div", { className: 'ml1' }, "|"),
                        react_1.default.createElement(react_router_dom_1.Link, { to: '/myrides', className: 'ml1 no-underline black' }, "my rides"))),
            react_1.default.createElement("div", { className: 'flex flex-fixed' }, userId ?
                react_1.default.createElement("div", { className: 'ml1 pointer black', onClick: () => {
                        localStorage.removeItem(constants_1.GC_USER_ID);
                        localStorage.removeItem(constants_1.GC_AUTH_TOKEN);
                        this.props.history.push(`/login`);
                    } }, "logout")
                :
                    react_1.default.createElement(react_router_dom_1.Link, { to: '/login', className: 'ml1 no-underline black' }, "login"))));
    }
}
exports.default = react_router_1.withRouter(Header);
//# sourceMappingURL=Header.js.map