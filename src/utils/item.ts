import {HydratedDocument} from 'mongoose'
import {IItem, IItemDocument} from '../types/IItem'
import {ItemModel} from '../models/item.model'
import {Types} from 'mongoose'

interface SaveItemDto extends Omit<IItem, 'instances' | 'subItems'> {
    instances?: string[]
    subItems?: SaveItemDto[]
}

export async function saveItemDocumentRecursively(
    itemData: SaveItemDto,
): Promise<HydratedDocument<IItemDocument> | undefined> {
    try {
        const subItemIds: Types.ObjectId[] = []
        if (itemData.subItems) {
            const subItems = await Promise.all(
                itemData.subItems.map(subItem =>
                    saveItemDocumentRecursively(subItem),
                ),
            )
            subItems.forEach(subItem => subItem && subItemIds.push(subItem._id))
        }
        const item = await new ItemModel<IItemDocument>({
            ...itemData,
            subItems: subItemIds,
            instances: itemData.instances || [],
        }).save()
        return item
    } catch (error) {
        console.error(error)
        return undefined
    }
}
