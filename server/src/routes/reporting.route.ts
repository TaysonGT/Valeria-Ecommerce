// routes/reporting.routes.ts
import express from 'express';
import { ReportingController } from '../controllers/reporting.controller';
import { auth, isPermitted } from '../middlewares/auth.middleware';

const reportingRouter = express.Router();
const reportingController = new ReportingController();

// All reporting routes require admin access
reportingRouter.use(auth);
reportingRouter.use(isPermitted('admin'));

// Main dashboard
reportingRouter.get('/dashboard', (req, res, next) => {
  void reportingController.getDashboard(req as any, res).catch(next);
});

// Individual metrics
reportingRouter.get('/sales', (req, res, next) => {
  void reportingController.getSalesOverview(req as any, res).catch(next);
});

reportingRouter.get('/top-products', (req, res, next) => {
  void reportingController.getTopProducts(req as any, res).catch(next);
});

reportingRouter.get('/low-stock', (req, res, next) => {
  void reportingController.getLowStock(req as any, res).catch(next);
});

reportingRouter.get('/order-status', (req, res, next) => {
  void reportingController.getOrderStatusDistribution(req as any, res).catch(next);
});

export default reportingRouter;