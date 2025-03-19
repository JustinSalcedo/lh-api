import express, {NextFunction, Request, Response} from 'express'
import {ItemDto} from '../dto/item.dto'
import {ItemModel} from '../models/item.model'
import {ItemMetadataDto} from '../dto/item-metadata.dto'
import {MasterListModel} from '../models/master-list.model'
import {RequestWithBody} from '../types'

const itemController = express.Router()

// add item to parent item
itemController.post(
    '/:parentItemId',
    async (
        req: RequestWithBody<ItemDto>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const {parentItemId} = req.params
            const parentItem = await ItemModel.findById(parentItemId)
            if (!parentItem) {
                res.status(404).send('Parent item not found')
                return
            }
            const item = await ItemModel.create(req.body)
            parentItem.subItems.push(item._id)
            await parentItem.save()
            res.status(201).json(item)
        } catch (e) {
            next(e)
        }
    },
)

// add many items to parent item
itemController.post(
    '/:parentItemId/many',
    async (
        req: RequestWithBody<ItemDto[]>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const {parentItemId} = req.params
            const parentItem = await ItemModel.findById(parentItemId)
            if (!parentItem) {
                res.status(404).send('Parent item not found')
                return
            }
            const items = await ItemModel.insertMany(req.body)
            parentItem.subItems.push(...items.map(item => item._id))
            await parentItem.save()
            res.status(201).json(items)
        } catch (e) {
            next(e)
        }
    },
)

// update item metadata
itemController.put(
    '/:id',
    async (
        req: RequestWithBody<ItemMetadataDto>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const item = await ItemModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                },
            )
            if (!item) {
                res.status(404).send('Item not found')
                return
            }
            res.json(item)
        } catch (e) {
            next(e)
        }
    },
)

// delete item and remove from all lists and items
itemController.delete(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const item = await ItemModel.findById(req.params.id)
            if (!item) {
                res.status(404).send('Item not found')
                return
            }
            await item.deleteOne()
            // query master lists using item id and remove item from list
            await MasterListModel.updateMany(
                {
                    items: item._id,
                },
                {
                    $pull: {
                        items: item._id,
                    },
                },
            )
            // query all items using item id and remove item from list
            await ItemModel.updateMany(
                {
                    subItems: item._id,
                },
                {
                    $pull: {
                        subItems: item._id,
                    },
                },
            )
            res.status(204).send()
        } catch (e) {
            next(e)
        }
    },
)

export default itemController
