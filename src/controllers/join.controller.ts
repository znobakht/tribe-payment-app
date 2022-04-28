import transactionModel from '@/models/transaction.model';
import userModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { joinPrice } from '@/config';
class PaymentController {
  public joinWithPass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const { password } = req.body;
      const email = req.body.email.trim();
      const userObject = await userModel.findOne({ email });
      if (!userObject) {
        return res.status(400).json({ message: 'user doesnt exist' });
      }
      const isMatch = bcrypt.compare(password, userObject.password);
      if (!isMatch) {
        return res.status(404).json({ message: 'password is incorrect' });
      }
      userObject.wallet -= joinPrice;
      userObject.save();
      await transactionModel.create({ email, joinPrice, type: 'buy' });
      res.json({ message: 'email added to community' });
    } catch (error) {
      next(error);
    }
  };
}

export default PaymentController;
