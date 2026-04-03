import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Food from '~/models/schemas/Food.schema'
import PTService from '~/models/schemas/PTService.schema'
import Order from '~/models/schemas/Order.schema'
import Cart from '~/models/schemas/Cart.schema'
import Review from '~/models/schemas/Review.schema'
import ChatRoom from '~/models/schemas/ChatRoom.schema'
import Analytics from '~/models/schemas/Analytic.schema'
config()
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const dbname = process.env.DB_NAME
if (!username || !password) {
  throw new Error('Missing DB_USERNAME or DB_PASSWORD in the .env file')
}
// const uri = `mongodb+srv://${username}:${password}@studymongodbbasic.nvb8bql.mongodb.net/?appName=StudyMongoDBBasic`
const uri = `mongodb+srv://${username}:${password}@studymongodbbasic.nvb8bql.mongodb.net/
`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])

    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true }) // báo lỗi nếu có 2 user cùng email
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }
  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])

    if (!exists) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get foods(): Collection<Food> {
    return this.db.collection(process.env.DB_FOODS_COLLECTION as string)
  }

  get ptServices(): Collection<PTService> {
    return this.db.collection(process.env.DB_PT_SERVICES_COLLECTION as string)
  }

  get orders(): Collection<Order> {
    return this.db.collection(process.env.DB_ORDERS_COLLECTION as string)
  }

  get carts(): Collection<Cart> {
    return this.db.collection(process.env.DB_CARTS_COLLECTION as string)
  }

  get reviews(): Collection<Review> {
    return this.db.collection(process.env.DB_REVIEWS_COLLECTION as string)
  }

  get chatrooms(): Collection<ChatRoom> {
    return this.db.collection(process.env.DB_CHATS_COLLECTION as string)
  }

  get analytics(): Collection<Analytics> {
    return this.db.collection(process.env.DB_ANALYTICS_COLLECTION as string)
  }
}

// Tạo object từ class DatabaseService
const databaseService = new DatabaseService()
export default databaseService
