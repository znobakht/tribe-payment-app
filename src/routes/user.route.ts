import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import userController from '@/controllers/user.controller';

class IndexRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new userController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**This function manages pay process */
    this.router.post(`${this.path}`, this.userController.registerUser);
  }
}

export default IndexRoute;
