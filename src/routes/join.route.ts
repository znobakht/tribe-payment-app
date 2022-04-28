import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PaymentController from '@/controllers/join.controller';

class PaymentRoute implements Routes {
  public path = '/join';
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**This function manages pay process */
    this.router.post(`${this.path}`, this.paymentController.joinWithPass);
  }
}

export default PaymentRoute;
