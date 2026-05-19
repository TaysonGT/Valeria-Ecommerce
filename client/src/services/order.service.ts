import axios from 'axios';
import { IOrder } from '../types';

export const fetchOrders = (status?: string, page = 1) =>
  axios.get<{ success: boolean; data: { orders: IOrder[]; statusCounts: any; pagination: any } }>('/orders', { params: { status, page } });

export const fetchOrderById = (id: string) =>
  axios.get<{ success: boolean; order: IOrder }>(`/orders/${id}`);

export const createOrder = (payload: any) =>
  axios.post<{ order: IOrder; payment: any }>('/orders', payload);