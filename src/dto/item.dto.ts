import {ExpandedFormat} from '../types'

export interface ItemDto {
    name: string
    instances?: string[]
    score?: number
    mandatory?: boolean
    subItems: ItemDto[]
    reps?: number
    expandedFormat?: ExpandedFormat
}
