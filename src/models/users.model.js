import mongoose from 'mongoose';
import usersSchema from '../schemas/users.schema.js';

const Users = mongoose.model('Users', usersSchema);

export default Users;
