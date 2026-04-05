import { Router } from 'express'
import {
  createPTServiceController,
  getPTServiceDetailController,
  getPTServiceListController,
  getPTUserByUsernameController
} from '~/controllers/pt.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ptRouter = Router()

/**
 * Description. Get PT service list with pagination
 * Path: /services
 * Method: GET
 * Query: { limit?: number, page?: number }
 */
ptRouter.get('/services', wrapRequestHandler(getPTServiceListController))

/**
 * Description. Get PT service detail by service id
 * Path: /services/:service_id
 * Method: GET
 * Params: { service_id: string }
 */
ptRouter.get('/services/:service_id', wrapRequestHandler(getPTServiceDetailController))

/**
 * Description. Create a new PT service package
 * Path: /services
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { title: string, description: string, price: number, sessions: number, durationDays: number, isActive?: boolean, ptId?: string }
 * Notes:
 * - Role PT: ptId is ignored and automatically resolved from current account.
 * - Role Admin: can create for a target PT by providing ptId.
 */
ptRouter.post('/services', accessTokenValidator, wrapRequestHandler(createPTServiceController))

/**
 * Description. Debug route to get PT user by username
 * Path: /debug/user-by-username
 * Method: GET
 * Query: { username: string }
 */
ptRouter.get('/debug/user-by-username', wrapRequestHandler(getPTUserByUsernameController))

export default ptRouter
