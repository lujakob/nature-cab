import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const rideSchema = new Schema({
  startLocation: {type: String, required: true},
  startLatLng: {type: [Number], default: [0,0]},
  startCity: {type: String, required: true},
  endLocation: {type: String, required: true},
  endLatLng: {type: [Number], default: [0,0]},
  endCity: {type: String, required: true},
  seats: {type: Number},
  price: {type: Number, required: true},
  vehicle: {type: String, default: 'CAR'},
  activity: {type: String},
  createdAt: {type: Date, default: Date.now()},
  startDate: {type: Date, required: true},
  returnInfo: {type: String},
  description: {type: String},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {collection: 'RideList'})

rideSchema.plugin(uniqueValidator)

const RIDE = mongoose.model('Ride', rideSchema)

export default RIDE