import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import JoinController from '@/controllers/join.controller';

class JoinRoute implements Routes {
  public path = '/join';
  public router = Router();
  public joinController = new JoinController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**This function manages pay process */
    this.router.post(`${this.path}`, this.joinController.joinWithPass);
  }
}

export default JoinRoute;
