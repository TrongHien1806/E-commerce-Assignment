import { Router } from 'express'
import { getDashboardStatsController } from '~/controllers/admin.controllers'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const adminRouter = Router()

/**
 * Description. Get system statistics for Admin Dashboard
 * Path: /admin/dashboard-stats
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
adminRouter.get(
  '/dashboard-stats',
  accessTokenValidator,
  isAdminValidator, // Chỉ Admin mới xem được thống kê
  wrapRequestHandler(getDashboardStatsController)
)

export default adminRouter