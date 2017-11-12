import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const rideSchema = new Schema({
  start: {type: String, required: true},
  end: {type: String, required: true},
  seats: {type: Number},
  price: {type: Number, required: true},
  activity: {type: String},
  createdAt: {type: Date, default: Date.now()},
  startDate: {type: Date, required: true},
  returnInfo: {type: String},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {collection: 'RideList'})

rideSchema.plugin(uniqueValidator)

const RIDE = mongoose.model('Ride', rideSchema)

export default RIDE