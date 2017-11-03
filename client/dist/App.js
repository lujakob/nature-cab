"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_apollo_1 = require("react-apollo");
const apollo_client_1 = require("apollo-client");
const Header_1 = require("./components/Header");
const RideListWithData_1 = require("./components/RideListWithData");
const MyRidesWithData_1 = require("./components/MyRidesWithData");
const RideDetail_1 = require("./components/RideDetail");
const CreateRide_1 = require("./components/CreateRide");
const Login_1 = require("./components/Login");
const Register_1 = require("./components/Register");
const constants_1 = require("./constants");
const networkInterface = apollo_client_1.createNetworkInterface({ uri: 'http://localhost:4000/graphql' });
networkInterface.use([{
        applyMiddleware(req, next) {
            if (!req.options.headers) {
                req.options.headers = {};
            }
            const token = localStorage.getItem(constants_1.GC_AUTH_TOKEN);
            req.options.headers.authorization = token ? `Bearer ${token}` : null;
            next();
        }
    }]);
const client = new apollo_client_1.default({ networkInterface });
class App extends react_1.Component {
    render() {
        return (react_1.default.createElement(react_apollo_1.ApolloProvider, { client: client },
            react_1.default.createElement("div", { className: 'center w85' },
                react_1.default.createElement(Header_1.default, null),
                react_1.default.createElement("div", { className: 'ph3 pv1 background-gray' },
                    react_1.default.createElement(react_router_dom_1.Switch, null,
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/', render: () => react_1.default.createElement(react_router_dom_1.Redirect, { to: '/ridelist' }) }),
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/login', component: Login_1.default }),
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/ridelist', component: RideListWithData_1.default }),
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/myrides', component: MyRidesWithData_1.default }),
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/ride/:id', component: RideDetail_1.default }),
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/create', component: CreateRide_1.default }),
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/register', component: Register_1.default }))))));
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map