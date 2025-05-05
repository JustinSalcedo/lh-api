import {model, Schema} from 'mongoose'
import {ITransactionDocument} from '../types/ITransaction'

export const TransactionSchema = new Schema<ITransactionDocument>({
    amount: {type: Number, required: true},
    description: {type: String, required: true},
    dateInMs: {type: Number, required: true},
})

export const TransactionModel = model<ITransactionDocument>(
    'Transaction',
    TransactionSchema,
)
