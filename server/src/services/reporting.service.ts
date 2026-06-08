// services/reporting.service.ts
import { Order } from '../schemas/order.schema';
import { Product } from '../schemas/product.schema';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export class ReportingService {

  // ==================== SALES METRICS ====================

  async getSalesOverview(dateRange: DateRange) {
    const match = {
      createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
      fulfillmentStatus: { $nin: ['cancelled', 'refunded'] }
    };

    const stats = await Order.aggregate([
      { $match: match },
      {
        $facet: {
          totalSales: [
            { $group: { _id: null, total: { $sum: "$grandTotal" } } }
          ],
          totalOrders: [
            { $count: "total" }
          ],
          averageOrderValue: [
            { $group: { _id: null, avg: { $avg: "$grandTotal" } } }
          ],
          byPaymentMethod: [
            { $group: { _id: "$paymentMethod", count: { $sum: 1 }, revenue: { $sum: "$grandTotal" } } }
          ]
        }
      }
    ]);

    return {
      totalRevenue: stats[0]?.totalSales[0]?.total ?? 0,
      totalOrders: stats[0]?.totalOrders[0]?.total ?? 0,
      averageOrderValue: stats[0]?.averageOrderValue[0]?.avg ?? 0,
      byPaymentMethod: stats[0]?.byPaymentMethod ?? []
    };
  }

  async getDailySales(dateRange: DateRange) {
    return await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          fulfillmentStatus: { $nin: ['cancelled', 'refunded'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$grandTotal" },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: "$grandTotal" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getMonthlySales(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    return await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          fulfillmentStatus: { $nin: ['cancelled', 'refunded'] }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$grandTotal" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  // ==================== ORDER STATUS METRICS ====================

  async getOrderStatusDistribution() {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$fulfillmentStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    const distribution = {
      pending: 0, processing: 0, shipped: 0, out_for_delivery: 0,
      delivered: 0, cancelled: 0, refunded: 0
    };

    stats.forEach(stat => {
      if (distribution.hasOwnProperty(stat._id)) {
        distribution[stat._id as keyof typeof distribution] = stat.count;
      }
    });

    return distribution;
  }

  async getDeliveryMethodBreakdown() {
    return await Order.aggregate([
      {
        $match: {
          deliveryType: { $exists: true, $ne: null },
          fulfillmentStatus: { $in: ['shipped', 'out_for_delivery', 'delivered'] }
        }
      },
      {
        $group: {
          _id: "$deliveryType",
          count: { $sum: 1 },
          orders: { $push: "$$ROOT" }
        }
      }
    ]);
  }

  async getAverageDeliveryTime() {
    const deliveredOrders = await Order.find({
      fulfillmentStatus: 'delivered',
      'statusTimestamps.shipped': { $exists: true },
      'statusTimestamps.delivered': { $exists: true }
    });

    let totalDays = 0;
    let count = 0;

    deliveredOrders.forEach(order => {
      const shippedAt = new Date(order.statusTimestamps.shipped!);
      const deliveredAt = new Date(order.statusTimestamps.delivered!);
      const days = (deliveredAt.getTime() - shippedAt.getTime()) / (1000 * 60 * 60 * 24);
      totalDays += days;
      count++;
    });

    return {
      averageDays: count > 0 ? totalDays / count : 0,
      sampleSize: count
    };
  }

  // ==================== PRODUCT METRICS ====================

  async getTopSellingProducts(limit: number = 10, dateRange?: DateRange) {
    const match: any = {};
    if (dateRange) {
      match.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
    }

    return await Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productTitle: { $first: "$items.productSnapshot.title" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      }
    ]);
  }

  async getLowStockProducts(threshold: number = 10) {
    const products = await Product.find({});
    
    const lowStock = products.map(product => {
      const totalStock = product.variants.reduce((sum, variant) => sum + variant.inventory.stock, 0);
      return {
        _id: product._id,
        title: product.title,
        totalStock,
        variants: product.variants.map(v => ({
          sizeCode: v.sizeCode,
          stock: v.inventory.stock
        })),
        isLowStock: totalStock <= threshold
      };
    }).filter(p => p.isLowStock);

    return lowStock;
  }

  async getInventoryValue() {
    const products = await Product.find({});
    
    let totalValue = 0;
    const breakdown = [];

    for (const product of products) {
      let productValue = 0;
      for (const variant of product.variants) {
        const price = product.basePrice + (variant.priceAdjustment || 0);
        const variantValue = price * variant.inventory.stock;
        productValue += variantValue;
      }
      totalValue += productValue;
      breakdown.push({
        productId: product._id,
        title: product.title,
        value: productValue
      });
    }

    return {
      totalInventoryValue: totalValue,
      breakdown: breakdown.sort((a, b) => b.value - a.value).slice(0, 10)
    };
  }

  // ==================== CUSTOMER METRICS ====================

  async getCustomerMetrics(dateRange?: DateRange) {
    const match: any = {};
    if (dateRange) {
      match.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
    }

    const customerStats = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$grandTotal" },
          orderCount: { $sum: 1 },
          lastOrder: { $max: "$createdAt" }
        }
      },
      {
        $facet: {
          topSpenders: [
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: "$user" }
          ],
          totalCustomers: [{ $count: "count" }],
          averageSpend: [{ $group: { _id: null, avg: { $avg: "$totalSpent" } } }]
        }
      }
    ]);

    return {
      totalCustomers: customerStats[0]?.totalCustomers[0]?.count || 0,
      averageCustomerLifetimeValue: customerStats[0]?.averageSpend[0]?.avg || 0,
      topSpenders: customerStats[0]?.topSpenders || []
    };
  }

  async getNewVsReturningCustomers(dateRange: DateRange) {
    const allOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
        }
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" }
        }
      }
    ]);

    let newCustomers = 0;
    let returningCustomers = 0;

    allOrders.forEach(customer => {
      const isFirstOrderInRange = customer.firstOrder >= dateRange.startDate;
      if (isFirstOrderInRange && customer.orderCount === 1) {
        newCustomers++;
      } else if (customer.orderCount > 1) {
        returningCustomers++;
      }
    });

    return {
      newCustomers,
      returningCustomers,
      totalUniqueCustomers: allOrders.length
    };
  }

  // ==================== DASHBOARD COMPOSITE ====================

  async getDashboardData(dateRange?: DateRange) {
    if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30); // Default to last 30 days
        dateRange = { startDate: start, endDate: end };
        console.log('Using default date range:', dateRange);
    }
    const [
      salesOverview,
      dailySales,
      orderStatus,
      topProducts,
      lowStock,
      customerMetrics,
      deliveryMetrics,
      inventoryValue
    ] = await Promise.all([
      this.getSalesOverview(dateRange),
      this.getDailySales(dateRange),
      this.getOrderStatusDistribution(),
      this.getTopSellingProducts(5, dateRange),
      this.getLowStockProducts(10),
      this.getCustomerMetrics(dateRange),
      this.getDeliveryMethodBreakdown(),
      this.getInventoryValue()
    ]);

    // Calculate growth compared to previous period
    const previousPeriod = {
      startDate: new Date(dateRange.startDate),
      endDate: new Date(dateRange.startDate)
    };
    previousPeriod.endDate.setDate(previousPeriod.endDate.getDate() - 1);
    previousPeriod.startDate.setMonth(previousPeriod.startDate.getMonth() - 1);

    const previousSales = await this.getSalesOverview(previousPeriod);

    const revenueGrowth = previousSales.totalRevenue > 0
      ? ((salesOverview.totalRevenue - previousSales.totalRevenue) / previousSales.totalRevenue) * 100
      : 100;

    return {
      period: {
        start: dateRange.startDate,
        end: dateRange.endDate
      },
      summary: {
        totalRevenue: salesOverview.totalRevenue,
        totalOrders: salesOverview.totalOrders,
        averageOrderValue: salesOverview.averageOrderValue,
        revenueGrowth: parseFloat(revenueGrowth.toFixed(2))
      },
      dailySales,
      orderStatus,
      topProducts,
      lowStockAlert: {
        count: lowStock.length,
        items: lowStock.slice(0, 5)
      },
      customers: customerMetrics,
      delivery: deliveryMetrics,
      inventoryValue: inventoryValue.totalInventoryValue
    };
  }
}
