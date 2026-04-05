import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import {
  CreateOrderReqBody,
  QuoteOrderReqBody,
  RetryPaymentReqBody,
  UpdateOrderStatusReqBody,
  UpdatePaymentStatusReqBody
} from '~/models/requests/CartOrder.request'
import Order, { OrderStatus, ShippingBreakdown } from '~/models/schemas/Order.schema'
import { UserRole } from '~/models/schemas/User.schema'
import cartService from '~/services/cart.services'
import databaseService from '~/services/database.services'

const SHIPPING_BASE_FEE = 20000
const SHIPPING_BASE_KM = 5
const SHIPPING_EXTRA_PER_KM = 5000

class OrdersService {
  private calculateShippingForDistance(distanceKm: number): ShippingBreakdown {
    const normalizedDistance = Math.max(0, distanceKm)
    const extraDistance = Math.max(0, normalizedDistance - SHIPPING_BASE_KM)
    const extraFee = Math.ceil(extraDistance) * SHIPPING_EXTRA_PER_KM

    return {
      baseFee: SHIPPING_BASE_FEE,
      extraFee,
      totalFee: SHIPPING_BASE_FEE + extraFee,
      distanceKm: Number(normalizedDistance.toFixed(2))
    }
  }

  private toValidDate(value: string, invalidMessage: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      throw new ErrorWithStatus({
        message: invalidMessage,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    return date
  }

  private resolveDistances(payload: QuoteOrderReqBody, daysCount: number) {
    if (payload.deliveryMode === 'WEEKLY_ONCE') {
      return [Number(payload.distanceKm ?? 0)]
    }

    if (payload.deliveryDistancesKm?.length) {
      if (payload.deliveryDistancesKm.length !== daysCount) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.DAILY_DISTANCE_COUNT_MISMATCH,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      return payload.deliveryDistancesKm.map((value) => Number(value || 0))
    }

    const fallbackDistance = Number(payload.distanceKm ?? 0)
    return Array.from({ length: daysCount }).map(() => fallbackDistance)
  }

  private resolveDeliverySchedule(payload: QuoteOrderReqBody): Date[] {
    if (payload.deliveryMode === 'WEEKLY_ONCE') {
      if (!payload.deliveryDate) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.DELIVERY_DATE_IS_REQUIRED,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }

      return [this.toValidDate(payload.deliveryDate, USERS_MESSAGES.DELIVERY_DATE_IS_REQUIRED)]
    }

    const deliveryDates = payload.deliveryDates || []
    if (deliveryDates.length !== 7) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.DAILY_DELIVERY_DATES_MUST_BE_7,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    return deliveryDates.map((item) => this.toValidDate(item, USERS_MESSAGES.DELIVERY_DATES_MUST_BE_ARRAY))
  }

  private async getRequestUser(userId: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { role: 1, account_status: 1 } }
    )

    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return user
  }

  async quoteOrder(userId: string, payload: QuoteOrderReqBody) {
    const cart = await cartService.buildCartSummary(userId)
    if (!cart.items.length) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.CART_IS_EMPTY,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const schedule = this.resolveDeliverySchedule(payload)
    const daysCount = schedule.length
    const resolvedDistances = this.resolveDistances(payload, daysCount)

    if (resolvedDistances.length !== schedule.length) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.DELIVERY_SCHEDULE_DISTANCE_MISMATCH,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const shippingBreakdowns = resolvedDistances.map((distance) => this.calculateShippingForDistance(distance))
    const shippingFee = shippingBreakdowns.reduce((sum, item) => sum + item.totalFee, 0)
    const subtotal = cart.summary.subtotal * daysCount
    const totalCalories = cart.summary.totalCalories * daysCount

    return {
      cart,
      pricing: {
        subtotal,
        shippingFee,
        grandTotal: subtotal + shippingFee,
        shippingBreakdowns,
        totalCalories
      },
      delivery: {
        mode: payload.deliveryMode,
        address: payload.deliveryAddress,
        schedule,
        daysCount
      },
      payment: {
        method: payload.paymentMethod
      },
      note: payload.note || ''
    }
  }

  async createOrder(userId: string, payload: CreateOrderReqBody) {
    const quote = await this.quoteOrder(userId, payload)

    const items = quote.delivery.schedule.flatMap((deliveryDate) =>
      quote.cart.items.map((item) => ({
        itemId: new ObjectId(String(item.itemId)),
        quantity: item.quantity,
        price: item.unitPrice,
        calories: item.unitCalories,
        deliveryDate: new Date(deliveryDate)
      }))
    )

    const order = new Order({
      userId: new ObjectId(userId),
      items,
      deliveryMode: payload.deliveryMode,
      deliverySchedule: quote.delivery.schedule,
      shippingBreakdowns: quote.pricing.shippingBreakdowns,
      subtotal: quote.pricing.subtotal,
      shippingFee: quote.pricing.shippingFee,
      grandTotal: quote.pricing.grandTotal,
      status: 'Pending',
      deliveryAddress: payload.deliveryAddress,
      note: payload.note || '',
      payment: {
        method: payload.paymentMethod,
        status: 'Pending'
      }
    })

    const inserted = await databaseService.orders.insertOne(order)
    await cartService.clearCart(userId)

    return {
      orderId: inserted.insertedId,
      ...order
    }
  }

  async getMyOrders(userId: string) {
    return databaseService.orders
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()
  }

  async getMyOrderDetail(userId: string, orderId: string) {
    const order = await databaseService.orders.findOne({ _id: new ObjectId(orderId), userId: new ObjectId(userId) })
    if (!order) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return order
  }

  async cancelOrder(userId: string, orderId: string) {
    const user = await this.getRequestUser(userId)

    const order = await databaseService.orders.findOne({ _id: new ObjectId(orderId) })
    if (!order) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const isOwner = String(order.userId) === userId

    if (user.role === UserRole.CUSTOMER) {
      if (!isOwner) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.ORDER_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      if (order.status !== 'Pending') {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.CUSTOMER_CAN_ONLY_CANCEL_PENDING_ORDER,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }

    if (user.role === UserRole.ADMIN) {
      if (order.status === 'Completed' || order.status === 'Cancelled') {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.ORDER_CAN_NOT_BE_CANCELLED,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.CUSTOMER) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.NOT_AUTHORIZED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    await databaseService.orders.updateOne(
      { _id: order._id },
      {
        $set: {
          status: 'Cancelled',
          cancelledBy: user.role === UserRole.ADMIN ? 'Admin' : 'Customer',
          cancelledAt: new Date()
        },
        $currentDate: { updatedAt: true }
      }
    )

    return {
      message: USERS_MESSAGES.CANCEL_ORDER_SUCCESS
    }
  }

  private assertAdmin(userRole: UserRole) {
    if (userRole !== UserRole.ADMIN) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.NOT_AUTHORIZED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
  }

  private canTransition(current: OrderStatus, next: Exclude<OrderStatus, 'Pending' | 'Cancelled'>) {
    if (current === 'Pending' && next === 'Cooking') return true
    if (current === 'Cooking' && next === 'Delivering') return true
    if (current === 'Delivering' && next === 'Completed') return true
    return false
  }

  async updateOrderStatus(adminUserId: string, orderId: string, payload: UpdateOrderStatusReqBody) {
    const admin = await this.getRequestUser(adminUserId)
    this.assertAdmin(admin.role)

    const order = await databaseService.orders.findOne({ _id: new ObjectId(orderId) })
    if (!order) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (order.status === 'Cancelled' || order.status === 'Completed') {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ORDER_STATUS_UPDATE_NOT_ALLOWED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (!this.canTransition(order.status, payload.status)) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ORDER_STATUS_TRANSITION_INVALID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    await databaseService.orders.updateOne(
      { _id: order._id },
      {
        $set: {
          status: payload.status
        },
        $currentDate: { updatedAt: true }
      }
    )

    return {
      message: USERS_MESSAGES.ORDER_STATUS_UPDATED_SUCCESS
    }
  }

  async retryPayment(userId: string, orderId: string, payload: RetryPaymentReqBody) {
    const order = await databaseService.orders.findOne({ _id: new ObjectId(orderId), userId: new ObjectId(userId) })
    if (!order) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (order.status === 'Cancelled' || order.status === 'Completed') {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ORDER_STATUS_UPDATE_NOT_ALLOWED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    await databaseService.orders.updateOne(
      { _id: order._id },
      {
        $set: {
          payment: {
            ...order.payment,
            method: payload.paymentMethod || order.payment.method,
            status: 'Pending'
          }
        },
        $currentDate: { updatedAt: true }
      }
    )

    return {
      message: USERS_MESSAGES.RETRY_PAYMENT_SUCCESS
    }
  }

  async updatePaymentStatus(adminUserId: string, orderId: string, payload: UpdatePaymentStatusReqBody) {
    const admin = await this.getRequestUser(adminUserId)
    this.assertAdmin(admin.role)

    const order = await databaseService.orders.findOne({ _id: new ObjectId(orderId) })
    if (!order) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.orders.updateOne(
      { _id: order._id },
      {
        $set: {
          payment: {
            method: order.payment.method,
            status: payload.status,
            transactionId: payload.transactionId || order.payment.transactionId
          }
        },
        $currentDate: { updatedAt: true }
      }
    )

    return {
      message: USERS_MESSAGES.PAYMENT_STATUS_UPDATED_SUCCESS,
      statusKept: order.status
    }
  }
}

const ordersService = new OrdersService()
export default ordersService
