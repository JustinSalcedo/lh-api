import {ItemDto} from './item.dto'

export interface ItemMetadataDto extends Omit<ItemDto, 'subItems'> {}
