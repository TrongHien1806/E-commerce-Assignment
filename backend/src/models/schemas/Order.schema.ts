import { ObjectId } from 'mongodb'

export type OrderItemType = 'Food' | 'PTService'
export type OrderStatus = 'Pending' | 'Cooking' | 'Delivering' | 'Completed' | 'Cancelled'
export type PaymentMethod = 'COD' | 'VNPay' | 'MoMo'
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed'

export interface OrderItem {
  itemType: OrderItemType
  itemId: ObjectId
  quantity: number
  price: number // snapshot giá tại thời điểm đặt
}

export interface PaymentInfo {
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
}

export interface OrderType {
  _id?: ObjectId
  userId: ObjectId
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  grandTotal: number
  status: OrderStatus
  deliveryAddress: string
  note: string
  payment: PaymentInfo
  createdAt?: Date
  updatedAt?: Date
}

export default class Order implements OrderType {
  _id?: ObjectId
  userId: ObjectId
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  grandTotal: number
  status: OrderStatus
  deliveryAddress: string
  note: string
  payment: PaymentInfo
  createdAt?: Date
  updatedAt?: Date
  constructor(order: OrderType) {
    this._id = order._id
    this.userId = order.userId
    this.items = order.items
    this.subtotal = order.subtotal
    this.shippingFee = order.shippingFee
    this.grandTotal = order.grandTotal
    this.status = order.status
    this.deliveryAddress = order.deliveryAddress
    this.note = order.note
    this.payment = order.payment
    const now = new Date()
    this.createdAt = order.createdAt || now
    this.updatedAt = order.updatedAt || now
  }
}
