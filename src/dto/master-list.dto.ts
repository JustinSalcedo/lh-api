import {ItemDto} from './item.dto'

export interface MasterListDto {
    name: string
    level: number
    items: ItemDto[]
    startDayTimeInMs: number
    endDayTimeInMs: number
}
