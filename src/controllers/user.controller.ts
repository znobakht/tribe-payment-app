import { NextFunction, Request, Response } from 'express';
import userModel from '@/models/users.model';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
const secretKey = process.env.secretKey || 'secret';
import jwt from 'jsonwebtoken';
import refreshTokenModel from '@/models/refreshToken.model';
import { v4 as uuidv4 } from 'uuid';

class userController {
  // public registerUser = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     res.render('home', { title: 'Starter App' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
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
      const userForSend: any = profile;
      // const userForSend: any = _.pick(profile, ['_id', 'name', 'email']);

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

      // const refreshToken = uuidv4();
      const refreshToken = 'uuidv4()';
      await refreshTokenModel.create({ user: userObject._id, refreshToken });

      // const token = sign({ user: { _id: userObject._id, email: userObject.email } }, secretKey);
      // // const userForSend: any = _.pick(userObject, ['_id', 'name', 'email']);
      res.status(200).json({ token: 'token', profile: userObject });
    } catch (error) {
      next(error);
    }
  };
  // public loginUser = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     res.render('home', { title: 'Starter App' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
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
      // const token = userObject.generateAuthToken();
      const token = 'userObject.generateAuthToken()';
      refreshTokenModel.create({ refreshToken, user: rtObject.user });
      rtObject.delete();
      res.status(200).json({ token, refreshToken });
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default userController;
