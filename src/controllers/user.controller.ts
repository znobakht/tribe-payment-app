import { NextFunction, Request, Response } from 'express';

class userController {
  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('home', { title: 'Starter App' });
    } catch (error) {
      next(error);
    }
  };
}

export default userController;
