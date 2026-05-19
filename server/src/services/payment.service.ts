// payment.service.ts
import { IOrder } from '../schemas/order.schema';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentGateway: string;
  error?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processingTime?: number;
  metadata?: {
    checkedAt?: string,
    mockData?: boolean,
    refundAmount?: number
  }
}

/**
 * Test payment processing function
 * Simulates payment gateway behavior without external APIs
 */
export const processPayment = async (
  order: IOrder,
  paymentMethod: string,
  paymentDetails?: any
): Promise<PaymentResult> => {
  // Simulate network delay (100-500ms)
  const delay = Math.random() * 400 + 100;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Random success rate (90% success, 10% failure for testing)
  const isSuccess = Math.random() < 0.9;
  
  // Generate fake transaction ID
  const transactionId = `TEST_TXN_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  if (isSuccess) {
    // Log for debugging
    console.log(`[TEST PAYMENT] Processing ${paymentMethod} payment for order ${order.orderNumber}`);
    console.log(`[TEST PAYMENT] Amount: ${order.currency} ${order.grandTotal}`);
    console.log(`[TEST PAYMENT] Transaction ID: ${transactionId}`);
    
    return {
      success: true,
      transactionId: transactionId,
      paymentGateway: paymentMethod,
      status: 'completed',
      processingTime: delay
    };
  } else {
    // Simulate various failure scenarios
    const failures = [
      'Insufficient funds',
      'Card declined',
      'Payment gateway timeout',
      'Invalid card number',
      'Payment processor error'
    ];
    
    const randomError = failures[Math.floor(Math.random() * failures.length)];
    
    console.log(`[TEST PAYMENT] Failed ${paymentMethod} payment for order ${order.orderNumber}`);
    console.log(`[TEST PAYMENT] Error: ${randomError}`);
    
    return {
      success: false,
      transactionId: transactionId,
      paymentGateway: paymentMethod,
      error: randomError,
      status: 'failed',
      processingTime: delay
    };
  }
};

// Optional: Function to simulate refunds
export const processRefund = async (
  order: IOrder,
  amount?: number
): Promise<PaymentResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const refundAmount = amount || order.grandTotal;
  const refundId = `TEST_REFUND_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  console.log(`[TEST PAYMENT] Processing refund for order ${order.orderNumber}`);
  console.log(`[TEST PAYMENT] Refund amount: ${order.currency} ${refundAmount}`);
  console.log(`[TEST PAYMENT] Refund ID: ${refundId}`);
  
  return {
    success: true,
    transactionId: refundId,
    paymentGateway: order.paymentMethod,
    status: 'refunded',
    metadata: { refundAmount }
  };
};

// Optional: Function to simulate payment status check
export const checkPaymentStatus = async (transactionId: string): Promise<PaymentResult> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    transactionId: transactionId,
    paymentGateway: 'test',
    status: 'completed',
    metadata: { 
      checkedAt: new Date().toISOString(),
      mockData: true 
    }
  };
};  