import {model, Schema} from 'mongoose'
import {IUserDocument} from '../types/IUser'

export const UserSchema = new Schema<IUserDocument>({
    name: {type: String, required: true},
    timezoneOffsetInHr: {type: Number, required: true},
    checklists: [{type: Schema.Types.ObjectId, ref: 'Checklist'}],
    currentChecklist: {type: Schema.Types.ObjectId, ref: 'Checklist'},
    // masterList: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'MasterList',
    //     required: true,
    // },
    level: {type: Number, default: 1},
    totalScore: {type: Number, default: 0},
    xp: {type: Number, default: 0},
    multiplier: {type: Number, default: 1},
    maxMultiplier: {type: Number, required: true},
    balance: {type: Number, default: 0},
})

export const UserModel = model<IUserDocument>('User', UserSchema)
