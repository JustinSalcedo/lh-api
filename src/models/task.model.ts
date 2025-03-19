import {model, Schema} from 'mongoose'
import {ITaskDocument} from '../types/ITask'

export const TaskSchema = new Schema<ITaskDocument>({
    name: {type: String, required: true},
    done: {type: Boolean, required: true},
    score: {type: Number, required: false},
    mandatory: {type: Boolean, default: false},
    reps: {type: Number, required: false},
    repsDone: {type: Number, required: false},
    expandedFormat: {type: String, required: false},
    subTasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
})

export const TaskModel = model<ITaskDocument>('Task', TaskSchema)
