import {MasterListDto} from './master-list.dto'

export interface MasterListMetadataDto extends Omit<MasterListDto, 'items'> {}
