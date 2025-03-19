import {Types} from 'mongoose'
import {ITask} from './ITask'
import {IUser} from './IUser'

export interface IChecklistDocument extends Omit<IChecklist, 'tasks' | 'user'> {
    tasks: Types.ObjectId[]
    user: Types.ObjectId
}

export interface IChecklist {
    dateStr: string
    score: number
    tasks: ITask[]
    startTimeInMs: number
    endTimeInMs: number
    processed: boolean
    reward?: number
    user: IUser
}
