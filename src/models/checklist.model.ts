import {model, Schema} from 'mongoose'
import {IChecklistDocument} from '../types/IChecklist'

export const ChecklistSchema = new Schema<IChecklistDocument>({
    dateStr: {type: String, required: true},
    score: {type: Number, default: 0},
    tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
    startTimeInMs: {type: Number, required: true},
    endTimeInMs: {type: Number, required: true},
    processed: {type: Boolean, default: false},
    reward: {type: Number, required: false},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
})

export const ChecklistModel = model<IChecklistDocument>(
    'Checklist',
    ChecklistSchema,
)
