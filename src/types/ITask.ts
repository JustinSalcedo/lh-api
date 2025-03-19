import {Types} from 'mongoose'
import {ExpandedFormat} from '.'

export interface ITaskDocument extends Omit<ITask, 'subTasks'> {
    subTasks: Types.ObjectId[]
}

export interface ITask {
    name: string
    done: boolean
    score?: number
    mandatory?: boolean
    reps?: number
    repsDone?: number
    expandedFormat?: ExpandedFormat
    subTasks: ITask[]
}
