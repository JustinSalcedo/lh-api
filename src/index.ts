import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import errorHandler from './middleware/error.middleware'
import userController from './controllers/user.controller'
import masterListController from './controllers/master-list.controller'
import itemController from './controllers/item.controller'
import checklistController from './controllers/checklist.controller'
import taskController from './controllers/task.controller'
import transactionController from './controllers/transaction.controller'

const app = express()
const port = process.env.PORT

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(function (_, res, next) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept',
//     )
//     next()
// })

// MongoDB connection
mongoose
    .connect(process.env.DB_CONNECTION_STRING ?? '')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))

// app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/users', userController)
app.use('/master', masterListController)
app.use('/items', itemController)
app.use('/checklist', checklistController)
app.use('/tasks', taskController)
app.use('/transactions', transactionController)

// Error handling
app.use(errorHandler)

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
