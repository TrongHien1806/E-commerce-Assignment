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

ordersRouter.post('/quote', accessTokenValidator, quoteOrderValidator, wrapRequestHandler(quoteOrderController))
ordersRouter.post('/', accessTokenValidator, createOrderValidator, wrapRequestHandler(createOrderController))
ordersRouter.get('/', accessTokenValidator, wrapRequestHandler(getMyOrdersController))
ordersRouter.get(
  '/:orderId',
  accessTokenValidator,
  orderIdParamValidator,
  wrapRequestHandler(getMyOrderDetailController)
)
ordersRouter.patch(
  '/:orderId/cancel',
  accessTokenValidator,
  orderIdParamValidator,
  wrapRequestHandler(cancelOrderController)
)
ordersRouter.patch(
  '/:orderId/status',
  accessTokenValidator,
  orderIdParamValidator,
  updateOrderStatusValidator,
  wrapRequestHandler(updateOrderStatusController)
)
ordersRouter.post(
  '/:orderId/payments/retry',
  accessTokenValidator,
  orderIdParamValidator,
  retryPaymentValidator,
  wrapRequestHandler(retryPaymentController)
)
ordersRouter.patch(
  '/:orderId/payment-status',
  accessTokenValidator,
  orderIdParamValidator,
  updatePaymentStatusValidator,
  wrapRequestHandler(updatePaymentStatusController)
)

export default ordersRouter
