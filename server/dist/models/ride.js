"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const uniqueValidator = require("mongoose-unique-validator");
const RideSchema = new mongoose_1.Schema({
    id: Number,
    userId: { type: Number, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    seats: { type: Number },
    activity: { type: String },
    createdAt: { type: Date, default: Date.now() },
    startDate: { type: Date, required: true },
    returnInfo: { type: String }
}, { collection: 'RideList' });
autoIncrement.initialize(mongoose_1.connection);
RideSchema.plugin(autoIncrement.plugin, {
    model: 'Ride',
    field: 'id',
    startAt: 1
});
RideSchema.plugin(uniqueValidator);
exports.RIDE = mongoose_1.model('Ride', RideSchema);
//# sourceMappingURL=ride.js.map