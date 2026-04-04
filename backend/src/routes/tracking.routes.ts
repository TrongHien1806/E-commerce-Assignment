import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { updateWeightValidator } from '~/middlewares/tracking.middlewares'
import {
  getDailyCaloriesController,
  getWeightHistoryController,
  updateWeightController
} from '~/controllers/tracking.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const trackingRouter = Router()

trackingRouter.put('/weight', accessTokenValidator, updateWeightValidator, wrapRequestHandler(updateWeightController))
trackingRouter.get('/weight-history', accessTokenValidator, wrapRequestHandler(getWeightHistoryController))
trackingRouter.get('/calories', accessTokenValidator, wrapRequestHandler(getDailyCaloriesController))

export default trackingRouter
