import {model, Schema} from 'mongoose'
import {IMasterListDocument} from '../types/IMasterList'

export const MasterListSchema = new Schema<IMasterListDocument>({
    name: {type: String, required: true},
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    level: {type: Number, required: true},
    startDayTimeInMs: {type: Number, required: true},
    endDayTimeInMs: {type: Number, required: true},
})

export const MasterListModel = model<IMasterListDocument>(
    'MasterList',
    MasterListSchema,
)
