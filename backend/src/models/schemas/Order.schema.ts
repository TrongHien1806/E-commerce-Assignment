import { ObjectId } from 'mongodb'

export type OrderItemType = 'Food' | 'PTService'
export type OrderStatus = 'Pending' | 'Cooking' | 'Delivering' | 'Completed' | 'Cancelled'
export type PaymentMethod = 'COD' | 'VNPay' | 'MoMo'
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed'
export type DeliveryMode = 'WEEKLY_ONCE' | 'DAILY'
export type CancelledBy = 'Customer' | 'Admin'

export interface OrderItem {
  itemType: OrderItemType
  itemId: ObjectId
  quantity: number
  price: number // snapshot giá tại thời điểm đặt
  calories: number // snapshot calories tại thời điểm đặt
}

export interface PaymentInfo {
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
}

export interface ShippingBreakdown {
  baseFee: number
  extraFee: number
  totalFee: number
  distanceKm: number
}

export interface OrderType {
  _id?: ObjectId
  userId: ObjectId
  items: OrderItem[]
  deliveryMode: DeliveryMode
  deliverySchedule: Date[]
  shippingBreakdowns: ShippingBreakdown[]
  subtotal: number
  shippingFee: number
  grandTotal: number
  status: OrderStatus
  deliveryAddress: string
  note: string
  cancelledBy?: CancelledBy
  cancelledAt?: Date
  payment: PaymentInfo
  createdAt?: Date
  updatedAt?: Date
}

export default class Order implements OrderType {
  _id?: ObjectId
  userId: ObjectId
  items: OrderItem[]
  deliveryMode: DeliveryMode
  deliverySchedule: Date[]
  shippingBreakdowns: ShippingBreakdown[]
  subtotal: number
  shippingFee: number
  grandTotal: number
  status: OrderStatus
  deliveryAddress: string
  note: string
  cancelledBy?: CancelledBy
  cancelledAt?: Date
  payment: PaymentInfo
  createdAt?: Date
  updatedAt?: Date
  constructor(order: OrderType) {
    this._id = order._id
    this.userId = order.userId
    this.items = order.items
    this.deliveryMode = order.deliveryMode
    this.deliverySchedule = order.deliverySchedule
    this.shippingBreakdowns = order.shippingBreakdowns
    this.subtotal = order.subtotal
    this.shippingFee = order.shippingFee
    this.grandTotal = order.grandTotal
    this.status = order.status
    this.deliveryAddress = order.deliveryAddress
    this.note = order.note
    this.cancelledBy = order.cancelledBy
    this.cancelledAt = order.cancelledAt
    this.payment = order.payment
    const now = new Date()
    this.createdAt = order.createdAt || now
    this.updatedAt = order.updatedAt || now
  }
}
