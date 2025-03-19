import {Request} from 'express'

export interface RequestWithBody<T extends Object> extends Request {
    body: T
}

export type ExpandedFormat = 'verb-noun' | 'action-to-sub' | 'part-of-sub'
