import { Router } from 'express'
import {
  cancelOrderController,
  createOrderController,
  getMyOrderDetailController,
  getMyOrdersController,
  quoteOrderController,
  retryPaymentController,
  updateOrderStatusController,
  updatePaymentStatusController
} from '~/controllers/orders.controllers'
import {
  createOrderValidator,
  orderIdParamValidator,
  quoteOrderValidator,
  retryPaymentValidator,
  updateOrderStatusValidator,
  updatePaymentStatusValidator
} from '~/middlewares/orders.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ordersRouter = Router()

/**
 * Description. Quote order pricing before placing order
 * Path: /quote
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body:
 *  - WEEKLY_ONCE: { deliveryAddress: string, deliveryMode: 'WEEKLY_ONCE', deliveryDate: string, distanceKm?: number, note?: string, paymentMethod: 'COD' | 'VNPay' | 'MoMo' }
 *  - DAILY (combo tuần): { deliveryAddress: string, deliveryMode: 'DAILY', deliveryDates: string[7], distanceKm?: number, deliveryDistancesKm?: number[7], note?: string, paymentMethod: 'COD' | 'VNPay' | 'MoMo' }
 */
ordersRouter.post('/quote', accessTokenValidator, quoteOrderValidator, wrapRequestHandler(quoteOrderController))

/**
 * Description. Create a new order from current cart
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: Same as quote payload
 */
ordersRouter.post('/', accessTokenValidator, createOrderValidator, wrapRequestHandler(createOrderController))

/**
 * Description. Get all orders of current user
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
ordersRouter.get('/', accessTokenValidator, wrapRequestHandler(getMyOrdersController))

/**
 * Description. Get detail of one order by id
 * Path: /:orderId
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: { orderId: string }
 */
ordersRouter.get(
  '/:orderId',
  accessTokenValidator,
  orderIdParamValidator,
  wrapRequestHandler(getMyOrderDetailController)
)

/**
 * Description. Cancel an order (Customer only when Pending, Admin allowed by policy)
 * Path: /:orderId/cancel
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { orderId: string }
 */
ordersRouter.patch(
  '/:orderId/cancel',
  accessTokenValidator,
  orderIdParamValidator,
  wrapRequestHandler(cancelOrderController)
)

/**
 * Description. Update order status in valid transition flow
 * Path: /:orderId/status
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { orderId: string }
 * Body: { status: 'Cooking' | 'Delivering' | 'Completed' }
 */
ordersRouter.patch(
  '/:orderId/status',
  accessTokenValidator,
  orderIdParamValidator,
  updateOrderStatusValidator,
  wrapRequestHandler(updateOrderStatusController)
)

/**
 * Description. Retry payment for an existing order
 * Path: /:orderId/payments/retry
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Params: { orderId: string }
 * Body: { paymentMethod?: 'COD' | 'VNPay' | 'MoMo' }
 */
ordersRouter.post(
  '/:orderId/payments/retry',
  accessTokenValidator,
  orderIdParamValidator,
  retryPaymentValidator,
  wrapRequestHandler(retryPaymentController)
)

/**
 * Description. Update payment status for an order
 * Path: /:orderId/payment-status
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { orderId: string }
 * Body: { status: 'Pending' | 'Paid' | 'Failed', transactionId?: string }
 */
ordersRouter.patch(
  '/:orderId/payment-status',
  accessTokenValidator,
  orderIdParamValidator,
  updatePaymentStatusValidator,
  wrapRequestHandler(updatePaymentStatusController)
)

export default ordersRouter
