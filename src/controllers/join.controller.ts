import transactionModel from '@/models/transaction.model';
import userModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { joinPrice } from '@/config';
import MemberController from './member.controller';
class PaymentController {
  public memberCtrl = new MemberController();
  public joinWithPass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const { password } = req.body;
      const email = req.body.email.trim();
      const userObject = await userModel.findOne({ email });
      if (!userObject) {
        return res.status(400).json({ message: 'user doesnt exist' });
      }
      const isMatch = await bcrypt.compare(password, userObject.password);
      if (!isMatch) {
        return res.status(404).json({ message: 'password is incorrect' });
      }
      if (userObject.wallet < joinPrice) {
        return res.status(404).json({ message: 'you need to charge your account' });
      }
      const newMember: any = await this.memberCtrl.addAMember(req);
      if (newMember?.accessToken) {
        userObject.wallet -= joinPrice;
        userObject.save();
        await transactionModel.create({ email, amount: joinPrice, type: 'buy' });
        res.json({ message: 'email added to community', accessToken: newMember.accessToken, refreshToken: newMember.refreshToken });
      } else {
        res.status(400).send(newMember);
      }
    } catch (error) {
      next(error);
    }
  };
}

export default PaymentController;
