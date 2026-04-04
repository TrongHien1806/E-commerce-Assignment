import { Router } from 'express'
import {
  createPTServiceController,
  getPTServiceDetailController,
  getPTServiceListController,
  getPTUserByUsernameController
} from '~/controllers/pt.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const ptRouter = Router()

ptRouter.get('/services', wrapRequestHandler(getPTServiceListController))
ptRouter.get('/services/:service_id', wrapRequestHandler(getPTServiceDetailController))
ptRouter.post('/services', wrapRequestHandler(createPTServiceController))
ptRouter.get('/debug/user-by-username', wrapRequestHandler(getPTUserByUsernameController))

export default ptRouter
