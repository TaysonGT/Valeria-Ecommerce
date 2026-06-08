// controllers/reporting.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ReportingService } from '../services/reporting.service';

const reportingService = new ReportingService()

export class ReportingController {

  async getDashboard(req: AuthenticatedRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const dateRange = startDate && endDate ? {
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string)
        } : undefined;
      
        console.log(`[${new Date().toISOString()}] Dashboard request received from ${req.user?.id}`);
        console.log('Headers already sent?', res.headersSent);
        console.log('date range:', dateRange);

      const dashboard = await reportingService.getDashboardData(dateRange);
        console.log('Sending response at:', new Date().toISOString());
        
        return res.json({
            success: true,
            data: dashboard
        });
    } catch (error: any) {
        console.log('Error at:', new Date().toISOString());
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSalesOverview(req: AuthenticatedRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      const dateRange = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      };

      const sales = await reportingService.getSalesOverview(dateRange);
      
      return res.json({ success: true, data: sales });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getTopProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const { startDate, endDate } = req.query;
      
      const dateRange = startDate && endDate ? {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      } : undefined;

      const products = await reportingService.getTopSellingProducts(limit, dateRange);
      
      return res.json({ success: true, data: products });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getLowStock(req: AuthenticatedRequest, res: Response) {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const lowStock = await reportingService.getLowStockProducts(threshold);
      
      return res.json({ success: true, data: lowStock });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOrderStatusDistribution(req: AuthenticatedRequest, res: Response) {
    try {
      const distribution = await reportingService.getOrderStatusDistribution();
      
      return res.json({ success: true, data: distribution });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}