import {Types} from 'mongoose'
import {IItem} from './IItem'

export interface IMasterListDocument extends Omit<IMasterList, 'items'> {
    items: Types.ObjectId[]
}

export interface IMasterList {
    name: string
    level: number
    items: IItem[]
    startDayTimeInMs: number
    endDayTimeInMs: number
}
