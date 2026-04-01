import { Router } from 'express'
import {
  accessTokenValidator,
  checkEmailExistQueryValidator,
  checkUsernameExistQueryValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator
} from '~/middlewares/users.middlewares'
import {
  checkEmailExistController,
  checkUsernameExistController,
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resetPasswordController
} from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description. Register a new user
 * Path: /register
 * Method: POST
 * Body: {
 *   email: string,
 *   username: string,
 *   password: string,
 *   confirm_password: string,
 *   phone: string,
 *   role?: 'Customer' | 'PT',
 *   healthProfile?: HealthProfile,
 *   ptProfile?: PTProfile
 * }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description. Login a user
 * Path: /login
 * Method: POST
 * Body: {  identifier: string; email?: string; password: string; remember_me?: boolean }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description. Check if email is already used
 * Path: /check-email
 * Method: GET
 * Query: { email: string }
 */
usersRouter.get('/check-email', checkEmailExistQueryValidator, wrapRequestHandler(checkEmailExistController))

/**
 * Description. Check if username is already used
 * Path: /check-username
 * Method: GET
 * Query: { username: string }
 */
usersRouter.get('/check-username', checkUsernameExistQueryValidator, wrapRequestHandler(checkUsernameExistController))

/**
 * Description. Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description. Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description. Forgot password by email
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description. Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { user_id: string, forgot_password_token: string, password: string, confirm_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

export default usersRouter
