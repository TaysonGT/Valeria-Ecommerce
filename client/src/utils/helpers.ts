import { IShippingAddress, PaymentMethodType } from "../types"

export const paymentMethodDisplayMap: Record<PaymentMethodType, string> = {
  credit_card: 'Credit Card',
  paypal: 'Paypal',
  stripe: 'Stripe',
  cod: 'COD'
};

/**
 * Generate next available ID for an array of items
 */
export const generateNextId = <T extends { id: string }>(items: T[]): number => {
  if (!items.length) return 1
  return Math.max(...items.map(item => parseInt(item.id))) + 1
}

/**
 * Format Numbers for display
 */
export const formatNumber = (amount: number, type='currency' as 'currency'|'number'): string => {
  if(type === 'currency'){
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }else{
    return amount.toLocaleString('en-US')
  }
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]{7,}$/
  return phoneRegex.test(phone)
}

export const formatDateInput = (date: string|number|Date): string => {
  return new Date(date).toISOString().split('T')[0]
}

export const formatDateDisplay = (date?: string|number|Date, opts?:{time?:boolean}): string => {
  const dateObject = new Date(date||new Date())
  return date?
    new Intl.DateTimeFormat("en-EG", {
      timeZone: "Africa/Cairo",
      ...opts?.time&&
        {timeStyle: "medium"}// Shows hours, minutes, seconds
      ,
      dateStyle: "medium", // Shows day, month, year
      hour12: true        // 12-hour format with AM/PM
    }).format(dateObject)
    : '-'
}

export const formatBytes = (bytes:number, decimals = 2)=>{
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const paymentMethodDisplay = (paymentMethod: string): string =>{
   if (paymentMethod in paymentMethodDisplayMap) {
    return paymentMethodDisplayMap[paymentMethod as PaymentMethodType];
  }
  return '-';
}

export const shippingAddressDisplay = (shippingAddress: IShippingAddress): string =>{
  return `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country}`
}