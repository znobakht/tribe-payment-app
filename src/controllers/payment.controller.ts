import transactionModel from '@/models/transaction.model';
import userModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';

class PaymentController {
  public pay = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, amount } = req.body;
      let userObject = await userModel.findOne({ email });
      if (userObject) {
        userObject.wallet += amount;
      } else {
        userObject = new userModel({ email, wallet: amount });
      }
      userObject.save();
      const transactionObject = await transactionModel.create({ email, amount, type: 'pay' });
      res.send(transactionObject);
    } catch (error) {
      next(error);
    }
  };
}

export default PaymentController;
