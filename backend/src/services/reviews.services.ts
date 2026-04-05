import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import Review, { ReviewTargetType } from '~/models/schemas/Review.schema'
import databaseService from './database.services'

type CreateReviewPayload = {
  targetType: ReviewTargetType
  targetId: string
  rating: number
  comment: string
  images?: string[]
}

class ReviewService {
  async createReview(reviewerId: string, payload: CreateReviewPayload) {
    const { targetType, targetId, rating, comment, images } = payload

    if (!ObjectId.isValid(targetId)) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.TARGET_ID_INVALID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const targetObjectId = new ObjectId(targetId)

    // 1) Check target exists
    if (targetType === 'Food') {
      const food = await databaseService.foods.findOne({ _id: targetObjectId, isActive: true })
      if (!food) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.TARGET_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
    } else {
      const pt = await databaseService.users.findOne({
        _id: targetObjectId,
        role: 'PT',
        account_status: 'Active'
      })
      if (!pt) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.TARGET_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
    }

    // 2) Check verified purchase
    const completedOrder = await databaseService.orders.findOne({
      userId: new ObjectId(reviewerId),
      status: 'Completed',
      items: {
        $elemMatch: {
          itemType: targetType === 'Food' ? 'Food' : 'PTService',
          itemId: targetObjectId
        }
      }
    })

    if (!completedOrder) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.REVIEW_FORBIDDEN,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    // 3) Optional: prevent duplicate review for same target
    const existingReview = await databaseService.reviews.findOne({
      reviewerId: new ObjectId(reviewerId),
      targetType,
      targetId: targetObjectId
    })

    if (existingReview) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.REVIEW_ALREADY_EXISTS,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const newReview = new Review({
      reviewerId: new ObjectId(reviewerId),
      targetType,
      targetId: targetObjectId,
      rating,
      comment: comment.trim(),
      images: images || [],
      verifiedPurchase: true
    })

    const result = await databaseService.reviews.insertOne(newReview)

    return {
      _id: result.insertedId,
      ...newReview
    }
  }

  async getReviews(targetType: ReviewTargetType, targetId: string) {
    if (!ObjectId.isValid(targetId)) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.TARGET_ID_INVALID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    return databaseService.reviews
      .find({
        targetType,
        targetId: new ObjectId(targetId)
      })
      .sort({ createdAt: -1 })
      .toArray()
  }
}

const reviewService = new ReviewService()
export default reviewService
