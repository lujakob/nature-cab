import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import findOrCreate from 'mongoose-find-or-create'

const Schema = mongoose.Schema

const userSchema = new Schema({
  gender: {type: String, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, default: ''},
  description: {type: String, default: ''},
  yearOfBirth: {type: String, required: true},
  phone: {type: String, default: ''},
  carType: {type: String, default: ''},
  carColor: {type: String, default: ''},
  facebookUserId: {type: String, default: ''},
  picture: {type: String, default: ''}
}, {collection: 'UserList'})

userSchema.plugin(uniqueValidator)
userSchema.plugin(findOrCreate)

const USER = mongoose.model('User', userSchema)

export default USER