"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new mongoose_1.Schema({
    userId: Number,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'UserList' });
autoIncrement.initialize(mongoose_1.connection);
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'userId',
    startAt: 1
});
userSchema.plugin(uniqueValidator);
exports.USER = mongoose_1.model('User', userSchema);
//# sourceMappingURL=user.js.map