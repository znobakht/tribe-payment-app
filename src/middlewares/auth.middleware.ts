import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import userModel from '@/models/users.model';
import jwt from 'jsonwebtoken';
import { secretKey } from '@/config';
const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const decoded: any = jwt.verify(req.headers.authorization, secretKey);
    console.log(decoded);

    if (!decoded) {
      return res.status(400).json({ message: 'invalid token' });
    }
    const userObject = await userModel.findById(decoded._id);
    if (!userObject) {
      return res.status(400).json({ message: 'user doesnt exist' });
    }
    req.user = userObject;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
