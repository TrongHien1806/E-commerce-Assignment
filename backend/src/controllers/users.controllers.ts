import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { TokenPayload } from '~/models/requests/User.request'
import { AccountStatus } from '~/models/schemas/User.schema'
import usersService from '~/services/user.services'

export const registerController = async (req: Request, res: Response) => {
  const result = await usersService.register(req.body)
  return res.status(HTTP_STATUS.CREATED).json(result)
}

export const loginController = async (req: Request, res: Response) => {
  const result = await usersService.login(req.body)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body as { refresh_token: string }
  const result = await usersService.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const decoded_refresh_token = (req as unknown as { decoded_refresh_token: TokenPayload }).decoded_refresh_token
  const { refresh_token } = req.body as { refresh_token: string }

  const result = await usersService.refreshToken({
    user_id: decoded_refresh_token.user_id,
    status: (decoded_refresh_token.status as AccountStatus) || AccountStatus.ACTIVE,
    refresh_token,
    exp: decoded_refresh_token.exp
  })

  return res.status(HTTP_STATUS.OK).json(result)
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }
  const result = await usersService.forgotPasswordByEmail(email)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { user_id, password, forgot_password_token } = req.body as {
    user_id: string
    password: string
    forgot_password_token: string
  }

  const result = await usersService.resetPassword({
    user_id,
    password,
    forgot_password_token
  })

  return res.status(HTTP_STATUS.OK).json(result)
}
