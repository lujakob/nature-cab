import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema

const userSchema = new Schema({
  userId: Number,
  name: String,
  email: String,
  password: String
}, {collection: 'UserList'})

autoIncrement.initialize(mongoose.connection);

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userId',
  startAt: 1
})

const USER = mongoose.model('User', userSchema)

export default USER