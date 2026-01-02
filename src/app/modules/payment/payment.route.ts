import express from 'express';
import { PaymentController } from './payment.controller';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router.post('/init-payment', checkAuth("user"), PaymentController.initPayment);

// SSL Commerz callbacks - accept both GET and POST
router.post('/success', PaymentController.successPayment);
router.get('/success', PaymentController.successPayment);

router.post('/fail', PaymentController.failPayment);
router.get('/fail', PaymentController.failPayment);

router.post('/cancel', PaymentController.cancelPayment);
router.get('/cancel', PaymentController.cancelPayment);

export const PaymentRoutes = router;
