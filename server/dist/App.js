"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const graphql_server_express_1 = require("graphql-server-express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const bearerToken = require("express-bearer-token");
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
const schema_1 = require("./schema");
const user_1 = require("./models/user");
const constants_1 = require("./constants");
class App {
    constructor() {
        this.users = [
            { id: 1, email: 'test', password: 'test', name: 'Lukas' },
            { id: 2, email: 'test2', password: 'test', name: 'Tom' }
        ];
        this.app = express();
        this.config();
        this.mountRoutes();
        this.initDB();
    }
    config() {
        this.app.use(bearerToken());
        // log requests to console
        this.app.use(morgan('dev'));
        this.app.use('*', cors({ origin: 'http://localhost:3000' }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }
    initDB() {
        mongoose_1.connect('mongodb://localhost:27017/naturecab', { useMongoClient: true });
        mongoose_1.connection.on('error', () => { console.log('---FAILED to connect to mongoose'); });
        mongoose_1.connection.once('open', () => {
            console.log('+++Connected to mongoose');
        });
    }
    /**
     * mountRoutes
     */
    mountRoutes() {
        this.app.post('/login', (req, res) => {
            if (!req.body.email || !req.body.password) {
                throw Error('email and password not in post request');
            }
            let { email, password } = req.body;
            // find user in DB and check password
            user_1.USER.findOne({ email: email }, (err, user) => {
                if (err) {
                    console.log('Login failed, user not found', err);
                }
                else {
                    if (!user) {
                        res.status(401).json({ message: 'no such user found' });
                    }
                    else {
                        bcrypt.compare(req.body.password, user.password).then(authenticated => {
                            if (authenticated) {
                                let payload = { id: user.userId };
                                let token = jwt.sign(payload, constants_1.JWT_SECRET);
                                res.json({ message: 'ok', token: token, id: user.userId });
                            }
                            else {
                                res.status(401).json({ message: 'passwords did not match' });
                            }
                        }).catch(err => console.log(err));
                    }
                }
            });
        });
        // graphql resource - add request token and user to context
        this.app.post('/graphql', this.authenticate.bind(this), graphql_server_express_1.graphqlExpress((request) => ({
            schema: schema_1.schema,
            context: {
                token: request.token,
                user: request.user
            }
        })));
        // graphiql
        this.app.use('/graphiql', graphql_server_express_1.graphiqlExpress({
            endpointURL: '/graphql'
        }));
    }
    authenticate(req, res, next) {
        if (req.token) {
            jwt.verify(req.token, constants_1.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log(err);
                }
                else if (decoded && decoded.id) {
                    req.user = this.users.find(user => user.id === decoded.id);
                }
            });
        }
        next();
    }
}
exports.default = new App().app;
//# sourceMappingURL=App.js.map