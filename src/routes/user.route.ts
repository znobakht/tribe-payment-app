import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import userController from '@/controllers/user.controller';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new userController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**This function manages pay process */
    this.router.post(`${this.path}`, this.userController.registerUser);
    this.router.post(`${this.path}/login`, this.userController.loginUser);
    this.router.post(`${this.path}/logout`, this.userController.logoutUser);
    this.router.post(`${this.path}/getToken`, this.userController.getToken);
  }
}

export default UserRoute;
