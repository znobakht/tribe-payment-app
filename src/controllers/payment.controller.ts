import transactionModel from '@/models/transaction.model';
import userModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
class PaymentController {
  public payWithEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.amount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const { amount } = req.body;
      const email = req.body.email.trim();
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
  public payWithPass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.amount || !req.body.password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const { password, amount } = req.body;
      const email = req.body.email.trim();
      const userObject = await userModel.findOne({ email });
      if (!userObject) {
        return res.status(400).json({ message: 'user doesnt exist' });
      }
      const isMatch = await bcrypt.compare(password, userObject.password);
      if (!isMatch) {
        return res.status(404).json({ message: 'password is incorrect' });
      }
      userObject.wallet += amount;
      userObject.save();
      await transactionModel.create({ email, amount, type: 'pay' });
      res.json({ message: `account of ${email} charged ${amount}$ successfully` });
    } catch (error) {
      next(error);
    }
  };
}

export default PaymentController;
