import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload
} from '~/models/requests/User.request'
import { AccountStatus } from '~/models/schemas/User.schema'
import usersService from '~/services/user.services'
import { USERS_MESSAGES } from '~/constants/messages'

export const registerController = async (
  req: Request<ParamsDictionary, Record<string, never>, RegisterReqBody>,
  res: Response
) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}
export const loginController = async (
  req: Request<ParamsDictionary, Record<string, never>, LoginReqBody>,
  res: Response
) => {
  const result = await usersService.login(req.body)
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, Record<string, never>, LogoutReqBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, Record<string, never>, RefreshTokenReqBody>,
  res: Response
) => {
  const decoded_refresh_token = (req as unknown as { decoded_refresh_token: TokenPayload }).decoded_refresh_token
  const { refresh_token } = req.body

  const result = await usersService.refreshToken({
    user_id: decoded_refresh_token.user_id,
    status: (decoded_refresh_token.status as AccountStatus) || AccountStatus.ACTIVE,
    refresh_token,
    exp: decoded_refresh_token.exp
  })

  return res.status(HTTP_STATUS.OK).json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, Record<string, never>, ForgotPasswordReqBody>,
  res: Response
) => {
  const { email } = req.body
  const result = await usersService.forgotPasswordByEmail(email)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, Record<string, never>, ResetPasswordReqBody>,
  res: Response
) => {
  const { user_id, password, forgot_password_token } = req.body

  const result = await usersService.resetPassword({
    user_id,
    password,
    forgot_password_token
  })

  return res.status(HTTP_STATUS.OK).json(result)
}

export const checkEmailExistController = async (req: Request, res: Response) => {
  const email = String(req.query.email || '').trim()
  const exists = await usersService.checkEmailExist(email)
  return res.status(HTTP_STATUS.OK).json({
    exists,
    message: exists ? USERS_MESSAGES.EMAIL_ALREADY_EXISTS : USERS_MESSAGES.EMAIL_AVAILABLE
  })
}

export const checkUsernameExistController = async (req: Request, res: Response) => {
  const username = String(req.query.username || '').trim()
  const exists = await usersService.checkUsernameExist(username)
  return res.status(HTTP_STATUS.OK).json({
    exists,
    message: exists ? USERS_MESSAGES.USERNAME_ALREADY_EXISTS : USERS_MESSAGES.USERNAME_AVAILABLE
  })
}
