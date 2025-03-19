import {model, Schema} from 'mongoose'
import {IItemDocument} from '../types/IItem'

export const ItemSchema = new Schema<IItemDocument>({
    name: {type: String, required: true},
    instances: [{type: String, required: true}],
    score: {type: Number, required: false},
    mandatory: {type: Boolean, required: false},
    subItems: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    reps: {type: Number, required: false},
    expandedFormat: {type: String, required: false},
})

export const ItemModel = model<IItemDocument>('Item', ItemSchema)
