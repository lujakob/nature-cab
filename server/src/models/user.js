import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const userSchema = new Schema({
  userId: Number,
  gender: {type: String, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  biography: {type: String, default: ''},
  yearOfBirth: {type: String, required: true},
  phone: {type: String, default: ''},
  car: {type: String, default: ''},
  carColor: {type: String, default: ''}
}, {collection: 'UserList'})

autoIncrement.initialize(mongoose.connection);

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userId',
  startAt: 1
})

userSchema.plugin(uniqueValidator)

const USER = mongoose.model('User', userSchema)

export default USER