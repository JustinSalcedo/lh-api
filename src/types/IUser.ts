import {Types} from 'mongoose'
import {IChecklist} from './IChecklist'
import {ITransaction} from './ITransaction'

export interface IUserDocument
    extends Omit<
        IUser,
        'checklists' | 'currentChecklist' | 'masterList' | 'transactions'
    > {
    checklists: Types.ObjectId[]
    currentChecklist?: Types.ObjectId
    // masterList: Types.ObjectId
    transactions: Types.ObjectId[]
}

export interface IUser {
    name: string
    timezoneOffsetInHr: number
    checklists: IChecklist[]
    currentChecklist?: IChecklist
    // masterList: IMasterList
    level: number
    totalScore: number
    xp: number
    multiplier: number
    maxMultiplier: number
    balance: number
    transactions: ITransaction[]
}
