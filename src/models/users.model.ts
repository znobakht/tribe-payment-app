import { model, Schema, Document } from 'mongoose';
//import { User } from '@interfaces/users.interface';
interface userInterface extends Document {
  name?: string;
  email: string;
  wallet: number;
}
const userSchema: Schema = new Schema<userInterface>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
});

const userModel = model<userInterface>('User', userSchema);

export default userModel;
