import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const rideSchema = new Schema({
  id: Number,
  userId: {type: Number, required: true},
  start: {type: String, required: true},
  end: {type: String, required: true},
  seats: {type: Number},
  price: Number,
  activity: {type: String},
  createdAt: {type: Date, default: Date.now()},
  startDate: {type: Date, required: true},
  returnInfo: {type: String},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {collection: 'RideList'})

autoIncrement.initialize(mongoose.connection);

rideSchema.plugin(autoIncrement.plugin, {
  model: 'Ride',
  field: 'id',
  startAt: 1
})

rideSchema.plugin(uniqueValidator)

const RIDE = mongoose.model('Ride', rideSchema)

export default RIDE