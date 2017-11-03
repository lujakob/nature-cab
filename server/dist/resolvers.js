"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./models/user");
const ride_1 = require("./models/ride");
const bcrypt = require("bcrypt");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const removePassword = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => {
            item.password = null;
            return item;
        });
    }
    else {
        if (!!data) {
            data.password = null;
        }
        return data;
    }
};
const isEmailValidationError = (err) => {
    return err.errors && err.errors.email && err.errors.email.properties && err.errors.email.properties.type && err.errors.email.properties.type === 'unique';
};
exports.resolvers = {
    Query: {
        rides: (root, args, context) => {
            let filter = {};
            // add 'start' filter
            if (args.start && args.start.length > 0) {
                Object.assign(filter, { start: args.start });
            }
            // add 'end' filter
            if (args.end && args.end.length > 0) {
                Object.assign(filter, { end: args.end });
            }
            // add 'activity' filter
            if (args.activity && args.activity.length > 0) {
                Object.assign(filter, { activity: args.activity });
            }
            Object.assign(filter, { startDate: { $gt: utils_1.getYesterday() } });
            return new Promise((resolve, reject) => {
                ride_1.RIDE
                    .find(filter, (err, rides) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        return resolve(rides);
                    }
                })
                    .sort({ startDate: 'asc' });
            });
        },
        myRides: (root, args, context) => {
            return new Promise((resolve, reject) => {
                ride_1.RIDE
                    .find({ 'userId': args.userId }, (err, rides) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        return resolve(rides);
                    }
                })
                    .sort({ startDate: 'asc' });
            });
        },
        ride: (root, { id }, context) => {
            return [];
            // return rides.find(ride => ride.id === id)
        },
        users: (root, args, context) => {
            return new Promise((resolve, reject) => {
                user_1.USER.find((err, users) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(removePassword(users));
                    }
                });
            });
        },
        user: (root, { userId }, context) => {
            return new Promise((resolve, reject) => {
                user_1.USER.findOne({ userId: userId }, (err, user) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(removePassword(user));
                    }
                });
            });
        }
    },
    Mutation: {
        addRide: (root, { ride }) => {
            return new Promise((resolve, reject) => {
                const newRide = new ride_1.RIDE({
                    userId: ride.userId,
                    start: ride.start,
                    end: ride.end,
                    seats: ride.seats,
                    activity: ride.activity,
                    startDate: ride.startDate,
                    returnInfo: ride.returnInfo
                });
                // save ride
                newRide.save((err, ride) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        return resolve(newRide);
                    }
                }).catch(err => console.log(err));
            });
        },
        createUser: (root, { user }) => {
            return new Promise((resolve, reject) => {
                // bcrypt password
                bcrypt.hash(user.password, constants_1.saltRounds).then(hash => {
                    const newUser = new user_1.USER({
                        name: user.name,
                        email: user.email,
                        password: hash
                    });
                    // save user
                    newUser.save((err, user) => {
                        if (err) {
                            if (isEmailValidationError(err)) {
                                reject('VALIDATION_EMAIL_UNIQUE');
                            }
                            else {
                                reject(err);
                            }
                            reject(err);
                        }
                        else {
                            return resolve(newUser);
                        }
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            });
        }
    },
};
//# sourceMappingURL=resolvers.js.map