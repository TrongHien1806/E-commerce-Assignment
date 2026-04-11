import { config } from 'dotenv'
import express from 'express'
import usersRouter from '~/routes/users.routes'
import cartRouter from '~/routes/cart.routes'
import ordersRouter from '~/routes/orders.routes'
import databaseService from '~/services/database.services'
import cors from 'cors'
import { defaultErrorHandler } from '~/middlewares/errors.middlewares'
import ptRouter from './routes/pt.routes'
import foodsRouter from './routes/foods.routes'
import trackingRouter from '~/routes/tracking.routes'
import reviewsRouter from '~/routes/reviews.routes'
import mediasRouter from './routes/medias.routes'
import adminRouter from './routes/admin.routes'

config()
// connect xong thì tạo index
databaseService.connect().then(async () => {
  await databaseService.indexUsers()
  await databaseService.indexRefreshTokens()
  await databaseService.indexCarts()
  await databaseService.indexOrders()
  await databaseService.indexCalorieLogs()
  // await autogenerateUsers()
  // await autogenerateTweets()
})
const app = express()
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
)

const port = process.env.PORT || 4000

// Tạo folder upload
app.use(express.json())
app.use('/users', usersRouter)
app.use('/cart', cartRouter)
app.use('/orders', ordersRouter)
app.use('/pt', ptRouter)
app.use('/foods', foodsRouter)
app.use('/tracking', trackingRouter)
app.use('/reviews', reviewsRouter)
app.use('/orders', ordersRouter)

// 1. Phải cấp quyền public thư mục 'uploads' thì Frontend mới xem được ảnh
app.use('/uploads', express.static('uploads'));

// 2. Đăng ký route medias
app.use('/medias', mediasRouter);

app.use('/admin', adminRouter)

app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
