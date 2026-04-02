import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { LoginReqBody, RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.request'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User, { AccountStatus, UserRole } from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { SignOptions } from 'jsonwebtoken'

config()

const MAX_LOGIN_ATTEMPTS = 5
const ACCOUNT_LOCK_MINUTES = 5
const REMEMBER_ME_SECONDS = 30 * 24 * 60 * 60

const parseExpiresIn = (value: string | undefined, fallbackSeconds: number): SignOptions['expiresIn'] => {
  if (!value || value.trim() === '') return fallbackSeconds
  const normalized = value.trim()
  const asNumber = Number(normalized)
  return Number.isNaN(asNumber) ? (normalized as SignOptions['expiresIn']) : asNumber
}

class UsersService {
  private getDefaultRefreshTokenExpiresIn() {
    return parseExpiresIn(process.env.REFRESH_TOKEN_EXPIRES_IN, 7 * 24 * 60 * 60)
  }

  private signAccessToken({ user_id, status }: { user_id: string; status: AccountStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        status
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: parseExpiresIn(process.env.ACCESS_TOKEN_EXPIRES_IN, 60 * 15)
      }
    })
  }

  private signRefreshToken({
    user_id,
    status,
    exp,
    remember_me
  }: {
    user_id: string
    status: AccountStatus
    exp?: number
    remember_me?: boolean
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          status,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }

    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        status
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: remember_me ? REMEMBER_ME_SECONDS : this.getDefaultRefreshTokenExpiresIn()
      }
    })
  }

  private signForgotPasswordToken({ user_id, status }: { user_id: string; status: AccountStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        status
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        // Link reset password 15 phút
        expiresIn: 15 * 60
      }
    })
  }

  private signAccessAndRefreshToken({
    user_id,
    status,
    remember_me
  }: {
    user_id: string
    status: AccountStatus
    remember_me?: boolean
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, status }),
      this.signRefreshToken({ user_id, status, remember_me })
    ])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  private async saveRefreshToken(user_id: ObjectId, refresh_token: string) {
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(new RefreshToken({ user_id, token: refresh_token, iat, exp }))
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email: email.toLowerCase().trim() })
    return Boolean(user)
  }

  async checkUsernameExist(username: string) {
    const user = await databaseService.users.findOne({ username: username.trim() })
    return Boolean(user)
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const role = payload.role || UserRole.CUSTOMER
    // PT mặc định sẽ có trạng thái pending, cần admin duyệt mới active để đăng nhập được
    const account_status = role === UserRole.PT ? AccountStatus.PENDING : AccountStatus.ACTIVE
    const username = payload.username.trim()

    await databaseService.users.insertOne(
      new User({
        _id: user_id,
        email: payload.email.toLowerCase().trim(),
        username,
        password: hashPassword(payload.password),
        phone: payload.phone,
        role,
        account_status,
        loginAttempts: 0,
        forgot_password_token: '',
        healthProfile: payload.healthProfile,
        ptProfile: payload.ptProfile,
        notifications: [],
        weightTracking: [],
        calorieTracking: []
      })
    )

    // PT cần chờ duyệt, chưa cấp token đăng nhập
    if (role === UserRole.PT) {
      return {
        requires_approval: true,
        message: USERS_MESSAGES.PT_SUCCESSFULLY_REGISTERED
      }
    }

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      status: AccountStatus.ACTIVE
    })

    await this.saveRefreshToken(user_id, refresh_token)

    return {
      access_token,
      refresh_token,
      role: UserRole.CUSTOMER
    }
  }

  async refreshToken({
    user_id,
    status,
    refresh_token,
    exp
  }: {
    user_id: string
    status: AccountStatus
    refresh_token: string
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, status }),
      this.signRefreshToken({ user_id, status, exp }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])

    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        iat: decoded_refresh_token.iat,
        exp: decoded_refresh_token.exp
      })
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  private async handleFailedLogin(user: User & { _id: ObjectId }) {
    const nextAttempts = (user.loginAttempts || 0) + 1

    if (nextAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + ACCOUNT_LOCK_MINUTES * 60 * 1000)
      await databaseService.users.updateOne(
        { _id: user._id },
        {
          $set: {
            account_status: AccountStatus.LOCKED,
            locked_until: lockedUntil,
            loginAttempts: 0
          },
          $currentDate: { updated_at: true }
        }
      )
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.TOO_MANY_LOGIN_ATTEMPTS,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    await databaseService.users.updateOne(
      { _id: user._id },
      {
        $set: { loginAttempts: nextAttempts },
        $currentDate: { updated_at: true }
      }
    )

    throw new ErrorWithStatus({
      message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }

  async login(payload: LoginReqBody) {
    const identifier = (payload.identifier || payload.email || '').trim()
    const user = await databaseService.users.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
    })

    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    // PT chưa duyệt không cho đăng nhập
    if (user.role === UserRole.PT && user.account_status === AccountStatus.PENDING) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.PT_ACCOUNT_PENDING_APPROVAL,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    if (user.account_status === AccountStatus.LOCKED && user.locked_until && user.locked_until > new Date()) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCOUNT_IS_TEMPORARILY_LOCKED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (hashPassword(payload.password) !== user.password) {
      return this.handleFailedLogin(user as User & { _id: ObjectId })
    }

    // Mở khóa nếu đã quá thời gian lock và reset login attempts
    await databaseService.users.updateOne(
      { _id: user._id },
      {
        $set: {
          loginAttempts: 0,
          account_status:
            user.account_status === AccountStatus.LOCKED
              ? user.role === UserRole.PT
                ? AccountStatus.PENDING
                : AccountStatus.ACTIVE
              : user.account_status
        },
        $unset: { locked_until: '' },
        $currentDate: { updated_at: true }
      }
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user._id!.toString(),
      status:
        user.account_status === AccountStatus.LOCKED
          ? user.role === UserRole.PT
            ? AccountStatus.PENDING
            : AccountStatus.ACTIVE
          : user.account_status,
      remember_me: payload.remember_me
    })

    await this.saveRefreshToken(user._id as ObjectId, refresh_token)

    return {
      access_token,
      refresh_token,
      role: user.role
    }
  }

  async logout(refresh_token: string) {
    console.log('Logging out, deleting refresh token:', refresh_token)
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }

  async forgotPasswordByEmail(email: string) {
    const user = await databaseService.users.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      // Trả generic message để tránh lộ email tồn tại hay không
      return {
        message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
      }
    }

    const forgot_password_token = await this.signForgotPasswordToken({
      user_id: user._id!.toString(),
      status: user.account_status
    })

    await databaseService.users.updateOne(
      { _id: user._id },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: { updated_at: true }
      }
    )

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
      forgot_password_token
    }
  }

  async resetPassword({
    user_id,
    password,
    forgot_password_token
  }: {
    user_id: string
    password: string
    forgot_password_token: string
  }) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user || !user.forgot_password_token || user.forgot_password_token !== forgot_password_token) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.RESET_PASSWORD_TOKEN_IS_INVALID_OR_USED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async getProfile(username: string) {
    const user = await databaseService.users.findOne(
      { username },
      {
        projection: {
          password: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )

    if (user === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return user
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload

    const updatedUser = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as UpdateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          forgot_password_token: 0
        }
      }
    )

    return updatedUser
  }

  async changePassword(user_id: string, new_password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(new_password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }
}

const usersService = new UsersService()
export default usersService
