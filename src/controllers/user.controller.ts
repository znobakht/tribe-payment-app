import userModel from '@/models/users.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
// import _ from 'lodash';
import refreshTokenModel from '@/models/refreshToken.model';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { secretKey } from '@/config';
class userController {
  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const password = req.body.password.trim();
      const email = req.body.email.trim();
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
      // const userForSend: any = _.pick(profile, ['_id', 'name', 'email']);

      return res.status(200).json({ message: 'account created successfully', profile: { _id: profile._id, email: profile.email } });
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
      const token = jwt.sign({ _id: userObject._id, email: userObject.email }, secretKey, {
        expiresIn: '1d',
      });
      // const token = userObject.generateAuthToken();

      const refreshToken = uuidv4();
      await refreshTokenModel.create({ user: userObject._id, token, refreshToken });
      // const userForSend: any = _.pick(userObject, ['_id', 'name', 'email']);
      res.status(200).json({ token, profile: { _id: userObject._id, email: userObject.email }, refreshToken });
    } catch (error) {
      next(error);
    }
  };
  public logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.refreshToken) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const rtObject = await refreshTokenModel.findOne({ refreshToken: req.headers.refreshToken });

      if (!rtObject) {
        return res.status(400).json({ message: 'you are not logged in' });
      }
      await refreshTokenModel.deleteMany({ refreshToken: req.headers.refreshToken });
      return res.status(200).json({ message: 'you logged out successfully' });
      next();
    } catch (error) {
      next(error);
    }
  };
  public getToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.refreshToken) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const refreshToken = req.headers.refreshToken;
      const rtObject = await refreshTokenModel.findOne({ refreshToken });

      if (!rtObject) {
        return res.status(400).json({ message: 'you are not logged in' });
      }
      const userObject = await userModel.findById(rtObject.user);
      if (!userObject) {
        return res.status(400).json({ message: 'user doesnt exist' });
      }
      const token = jwt.sign({ _id: userObject._id, email: userObject.email }, secretKey, {
        expiresIn: '1d',
      });
      // const token = userObject.generateAuthToken();

      res.status(200).json({ token, refreshToken });
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default userController;
