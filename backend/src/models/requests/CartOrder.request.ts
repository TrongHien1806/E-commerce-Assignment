import { PaymentMethod, PaymentStatus, OrderStatus, DeliveryMode } from '~/models/schemas/Order.schema'

export interface AddCartItemReqBody {
  itemId: string
  quantity: number
}

export interface UpdateCartItemReqBody {
  quantity: number
}

export interface QuoteOrderReqBody {
  deliveryAddress: string
  deliveryMode: DeliveryMode
  deliveryDate?: string
  deliveryDates?: string[]
  distanceKm?: number
  deliveryDistancesKm?: number[]
  note?: string
  paymentMethod: PaymentMethod
}

export type CreateOrderReqBody = QuoteOrderReqBody

export interface UpdateOrderStatusReqBody {
  status: Exclude<OrderStatus, 'Pending' | 'Cancelled'>
}

export interface RetryPaymentReqBody {
  paymentMethod?: PaymentMethod
}

export interface UpdatePaymentStatusReqBody {
  status: PaymentStatus
  transactionId?: string
}
