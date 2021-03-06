import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PaymentController from '@/controllers/payment.controller';

class PaymentRoute implements Routes {
  public path = '/payment';
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**This function manages pay process */
    this.router.post(`${this.path}/email`, this.paymentController.payWithEmail);
    this.router.post(`${this.path}/pass`, this.paymentController.payWithPass);
  }
}

export default PaymentRoute;
