import { config } from 'dotenv'
import express from 'express'
import usersRouter from '~/routes/users.routes'
import cartRouter from '~/routes/cart.routes'
import ordersRouter from '~/routes/orders.routes'
import databaseService from '~/services/database.services'
import cors from 'cors'
import { defaultErrorHandler } from '~/middlewares/errors.middlewares'

config()
// connect xong thì tạo index
databaseService.connect().then(async () => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexCarts()
  databaseService.indexOrders()
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

app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
