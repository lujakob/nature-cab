"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const constants_1 = require("../constants");
class Login extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            email: '',
            password: '',
            status: null
        };
        this._confirm = () => __awaiter(this, void 0, void 0, function* () {
            // return if fields are empty
            if (!this.state.email || !this.state.password) {
                this.setState({ status: true });
                return;
            }
            let result = yield this.fetchAsync();
            this.setState({ email: '', password: '' });
            if (result.message === 'ok') {
                this._saveUserData(result);
                this.props.history.push(`/ridelist`);
            }
            else if (result.status && result.status === constants_1.STATUS_CODE.UNAUTHORIZED) {
                this.setState({ status: constants_1.STATUS_CODE.UNAUTHORIZED });
            }
            else {
                throw new Error('Login failed');
            }
        });
        this._saveUserData = ({ id, token }) => {
            localStorage.setItem(constants_1.GC_USER_ID, id);
            localStorage.setItem(constants_1.GC_AUTH_TOKEN, token);
        };
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                react_1.default.createElement("input", { type: "text", placeholder: "Email", value: this.state.email, onChange: (evt) => this.setState({ email: evt.target.value, status: null }) })),
            react_1.default.createElement("div", null,
                react_1.default.createElement("input", { type: "text", placeholder: "Password", value: this.state.password, onChange: (evt) => this.setState({ password: evt.target.value, status: null }) })),
            this.state.status &&
                react_1.default.createElement("div", { className: "error-message dark-red" }, "Please check email and password to try again."),
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: 'pointer mr2 button', onClick: () => this._confirm() }, "Login")),
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: 'pointer mr2 button', onClick: () => this.props.history.push('/register') }, "Register"))));
    }
    // request login
    fetchAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('http://localhost:4000/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'Application/JSON',
                    'Content-Type': 'Application/JSON'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            });
            if (response.ok) {
                return yield response.json();
            }
            else {
                return response;
            }
        });
    }
}
exports.default = Login;
//# sourceMappingURL=Login.js.map