import { model, Schema, Document } from 'mongoose';
//import { User } from '@interfaces/users.interface';
const secretKey = process.env.secretKey || 'secret';
import jwt from 'jsonwebtoken';
interface userInterface extends Document {
  name?: string;
  email: string;
  password: string;
  wallet: number;
  generateAuthToken(): any;
}
const userSchema: Schema = new Schema<userInterface>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, secretKey, {
    expiresIn: '5d',
  });
};
const userModel = model<userInterface>('User', userSchema);

export default userModel;
