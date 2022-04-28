import { model, Schema, Document } from 'mongoose';

export interface RefreshTokenInterface extends Document {
  // token: string;
  refreshToken?: string;
  user?: string;
  expire: Date;
}
const RefreshTokenSchema: Schema = new Schema<RefreshTokenInterface>({
  // token: {
  //   type: String,
  //   required: true,
  // },
  refreshToken: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expire: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7,
  },
});

export default model<RefreshTokenInterface>('RefreshToken', RefreshTokenSchema);
