import { IShippingAddress, PaymentMethodType } from "../types"

/**
 * Generate next available ID for an array of items
 */
export const generateNextId = <T extends { id: string }>(items: T[]): number => {
  if (!items.length) return 1
  return Math.max(...items.map(item => parseInt(item.id))) + 1
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
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

export const formatDateDisplay = (date?: string|number|Date): string => {
  return date? 
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) 
    : '-'
}

export const paymentMethodDisplay = (paymentMethod: string): string =>{
  const exists = paymentMethod in PaymentMethodType
  return exists? PaymentMethodType[paymentMethod as keyof typeof PaymentMethodType]:'-'
}

export const shippingAddressDisplay = (shippingAddress: IShippingAddress): string =>{
  return `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country}`
}

