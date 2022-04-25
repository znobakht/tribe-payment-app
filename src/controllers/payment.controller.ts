import transactionModel from '@/models/transaction.model';
import userModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';

class PaymentController {
  public pay = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.amount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const { email, amount } = req.body;
      let userObject = await userModel.findOne({ email });
      if (userObject) {
        userObject.wallet += amount;
      } else {
        userObject = new userModel({ email, wallet: amount });
      }
      userObject.save();
      await transactionModel.create({ email, amount, type: 'pay' });
      res.json({ message: `account of ${email} charged ${amount}$ successfully` });
    } catch (error) {
      next(error);
    }
  };
}

export default PaymentController;
