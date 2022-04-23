import { model, Schema, Document } from 'mongoose';
interface transactionInterface extends Document {
  email: string;
  amount: number;
  type: string; //buy or pay
}
const transactionSchema: Schema = new Schema<transactionInterface>({
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const transactionModel = model<transactionInterface>('transaction', transactionSchema);

export default transactionModel;
