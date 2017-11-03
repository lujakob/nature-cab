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
const graphql_tag_1 = require("graphql-tag");
const react_apollo_1 = require("react-apollo");
const constants_1 = require("../constants");
class Register extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            name: '',
            email: '',
            password: '',
            status: null
        };
        this._submit = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.state.name || !this.state.email || !this.state.password) {
                this.setState({ status: constants_1.VALIDATION.VALIDATION_REQUIRED });
                return;
            }
            let newUser = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            };
            yield this.props.createUserMutation({
                variables: { user: newUser },
                update: (store, { data: { createUser } }) => { }
            })
                .then(() => {
                this.setState({ name: '', email: '', password: '', status: null });
                this.props.history.push('/login');
            })
                .catch(err => {
                if (err.message.indexOf(constants_1.VALIDATION.VALIDATION_EMAIL_UNIQUE) >= 0) {
                    this.setState({ status: constants_1.VALIDATION.VALIDATION_EMAIL_UNIQUE });
                }
                console.log('error', err);
            });
        });
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("h2", null, "Register new user"),
            react_1.default.createElement("div", null,
                react_1.default.createElement("input", { type: "text", placeholder: "Name", value: this.state.name, onChange: (evt) => this.setState({ name: evt.target.value, status: null }) })),
            react_1.default.createElement("div", null,
                react_1.default.createElement("input", { type: "text", placeholder: "Email", value: this.state.email, onChange: (evt) => this.setState({ email: evt.target.value, status: null }) })),
            react_1.default.createElement("div", null,
                react_1.default.createElement("input", { type: "text", placeholder: "Password", value: this.state.password, onChange: (evt) => this.setState({ password: evt.target.value, status: null }) })),
            this.state.status === constants_1.VALIDATION.VALIDATION_REQUIRED &&
                react_1.default.createElement("div", { className: "error-message dark-red" }, "Please fill out all fields."),
            this.state.status === constants_1.VALIDATION.VALIDATION_EMAIL_UNIQUE &&
                react_1.default.createElement("div", { className: "error-message dark-red" }, "This email is already taken."),
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: 'pointer mr2 button', onClick: () => this._submit() }, "Submit"))));
    }
}
const CreateUserMutation = graphql_tag_1.default `
  mutation createUser($user: UserInput!) {
    createUser(user: $user) {
      name
      email
      password
    }
  }
`;
exports.default = react_apollo_1.graphql(CreateUserMutation, { name: 'createUserMutation' })(Register);
//# sourceMappingURL=Register.js.map