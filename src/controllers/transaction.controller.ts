import express, {NextFunction, Request, Response} from 'express'
import {TransactionModel} from '../models/transaction.model'
import {RequestWithBody} from '../types'
import {TransactionDto} from '../dto/transaction.dto'
import {UserModel} from '../models/user.model'

const transactionController = express.Router()

// create transaction by userId
transactionController.post(
    '/:userId',
    async (
        req: RequestWithBody<TransactionDto>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const {userId} = req.params
            const user = await UserModel.findById(userId)
            if (!user) {
                res.status(404).send('User not found')
                return
            }
            // throw Bad Request if amount is not provided
            if (!req.body.amount) {
                res.status(400).send('Amount is required')
                return
            }
            const transaction = await TransactionModel.create(req.body)
            user.transactions.push(transaction._id)
            // update user balance
            user.balance += transaction.amount
            await user.save()
            res.status(201).json(transaction)
        } catch (error) {
            next(error)
        }
    },
)

// get all transactions by userId
transactionController.get('/:userId', async (req: Request, res: Response) => {
    const {userId} = req.params
    const user = await UserModel.findById(userId)
    if (!user) {
        res.status(404).send('User not found')
        return
    }
    const transactions = await TransactionModel.find({
        _id: {$in: user.transactions},
    })
    res.status(200).json(transactions)
})

// update transaction by userId and transactionId
transactionController.put(
    '/:userId/:transactionId',
    async (
        req: RequestWithBody<Partial<TransactionDto>>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const {userId, transactionId} = req.params
            const user = await UserModel.findById(userId)
            if (!user) {
                res.status(404).send('User not found')
                return
            }
            // throw Bad Request if amount is equal to 0
            if (req.body.amount === 0) {
                res.status(400).send('Amount cannot be 0')
                return
            }
            // find transaction by id
            const transaction = await TransactionModel.findById(transactionId)
            if (!transaction) {
                res.status(404).send('Transaction not found')
                return
            }
            const oldTransactionAmount = transaction.amount
            const newTransactionAmount = req.body.amount

            const updatedTransaction = await TransactionModel.findByIdAndUpdate(
                transactionId,
                req.body,
                {new: true},
            )
            if (
                newTransactionAmount &&
                newTransactionAmount !== oldTransactionAmount
            ) {
                user.balance += newTransactionAmount - oldTransactionAmount
                await user.save()
            }

            res.status(200).json(updatedTransaction)
        } catch (error) {
            next(error)
        }
    },
)

// delete transaction by userId and transactionId
transactionController.delete(
    '/:userId/:transactionId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userId, transactionId} = req.params
            const user = await UserModel.findById(userId)
            if (!user) {
                res.status(404).send('User not found')
                return
            }
            const transaction = await TransactionModel.findByIdAndDelete(
                transactionId,
            )
            if (!transaction) {
                res.status(404).send('Transaction not found')
                return
            }
            // remove transaction from user transactions array
            user.transactions = user.transactions.filter(
                (t: any) => t.toString() !== transactionId,
            )
            // revert user balance
            user.balance -= transaction.amount
            await user.save()
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    },
)

export default transactionController
