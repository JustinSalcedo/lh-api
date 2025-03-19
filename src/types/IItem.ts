import {Types} from 'mongoose'
import {ExpandedFormat} from '.'

export interface IItemDocument extends Omit<IItem, 'subItems'> {
    subItems: Types.ObjectId[]
}

export interface IItem {
    name: string
    instances: string[]
    score?: number
    mandatory?: boolean
    subItems: IItem[]
    reps?: number
    expandedFormat?: ExpandedFormat
}
