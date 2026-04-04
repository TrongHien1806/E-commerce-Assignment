import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'

class TrackingService {
  async updateWeight(user_id: string, payload: { date: string; weightKg: number }) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy người dùng',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const inputDate = new Date(payload.date)
    inputDate.setHours(0, 0, 0, 0)

    const existingIndex =
      user.weightTracking?.findIndex((item) => {
        const d = new Date(item.date)
        d.setHours(0, 0, 0, 0)
        return d.getTime() === inputDate.getTime()
      }) ?? -1

    if (existingIndex >= 0) {
      await databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id),
          'weightTracking.date': user.weightTracking[existingIndex].date
        },
        {
          $set: {
            'weightTracking.$.weightKg': payload.weightKg
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    } else {
      await databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $push: {
            weightTracking: {
              date: inputDate,
              weightKg: payload.weightKg
            }
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    }

    return {
      date: inputDate,
      weightKg: payload.weightKg
    }
  }

  async getWeightHistory(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          weightTracking: 1
        }
      }
    )

    if (!user) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy người dùng',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const history = [...(user.weightTracking || [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return history
  }

  async getDailyCalories(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          calorieTracking: 1,
          healthProfile: 1
        }
      }
    )

    if (!user) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy người dùng',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return {
      targetCalories: user.healthProfile?.targetCalories || 0,
      history: user.calorieTracking || []
    }
  }
}

const trackingService = new TrackingService()
export default trackingService
