import userModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import _ from 'lodash';

class userController {
  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const { email, password } = req.body;
      const userObject = await userModel.findOne({ email });
      if (userObject) {
        return res.status(400).json({ message: 'This email is in use' });
      }
      const salt = await bcrypt.genSalt(10);
      const newPass = await bcrypt.hash(password, salt);
      const profile = await userModel.create({
        email,
        password: newPass,
      });
      const userForSend: any = _.pick(profile, ['_id', 'name', 'email']);

      return res.status(200).json({ message: 'account created successfully', profile: userForSend });
    } catch (error) {
      next(error);
    }
  };
  public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const { email, password } = req.body;
      const userObject = await userModel.findOne({ email });
      if (!userObject) {
        return res.status(400).json({ message: 'user doesnt exist' });
      }
      const isMatch = bcrypt.compare(password, userObject.password);
      if (!isMatch) {
        return res.status(404).json({ message: 'password is incorrect' });
      }
      const token = userObject.generateAuthToken();
      const userForSend: any = _.pick(userObject, ['_id', 'name', 'email']);
      res.status(200).json({ token: 'Bearer ' + token, profile: userForSend });
    } catch (error) {
      next(error);
    }
  };
}

export default userController;
