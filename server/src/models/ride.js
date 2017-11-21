import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

// const latLngType = {
//   type: Object,
//   properties: {
//     type: {
//       type: String,
//       enum: 'Point',
//       default: 'Point'
//     },
//     coordinates: {
//       type: [Number],
//       default: [0, 0]
//     }
//   }
// }

const latLngType = {type: [Number]}

const rideSchema = new Schema({
  startLocation: {type: String, required: true},
  startLatLng: latLngType,
  startCity: {type: String, required: true},
  endLocation: {type: String, required: true},
  endLatLng: latLngType,
  endCity: {type: String, required: true},
  seats: {type: Number},
  price: {type: Number, required: true},
  vehicle: {type: String, default: 'CAR'},
  activity: {type: String},
  createdAt: {type: Date, default: Date.now()},
  startDate: {type: Date, required: true},
  returnInfo: {type: String},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {collection: 'RideList'})

rideSchema.plugin(uniqueValidator)

const RIDE = mongoose.model('Ride', rideSchema)

export default RIDE