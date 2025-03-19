import express, {NextFunction, Request, Response} from 'express'
import {MasterListModel} from '../models/master-list.model'
import {MasterListDto} from '../dto/master-list.dto'
import {MasterListMetadataDto} from '../dto/master-list-metadata.dto'
import {ItemDto} from '../dto/item.dto'
import {ItemModel} from '../models/item.model'
import {RequestWithBody} from '../types'
import {IMasterListDocument} from '../types/IMasterList'
import {saveItemDocumentRecursively} from '../utils/item'
import {Types} from 'mongoose'
import {POPULATE_ITEMS, POPULATE_SUBITEMS} from '../constants'

const masterListController = express.Router()

// get the first master list found
masterListController.get(
    '/',
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            const masterList = (await MasterListModel.find())[0]
            if (!masterList) {
                res.status(404).send('Master list not found')
                return
            }
            res.json(await masterList.populate(POPULATE_ITEMS))
        } catch (error) {
            next(error)
        }
    },
)

// get master list by id
masterListController.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const masterList = await MasterListModel.findById(req.params.id)
            if (!masterList) {
                res.status(404).send('Master list not found')
                return
            }
            res.json(await masterList.populate(POPULATE_ITEMS))
        } catch (error) {
            next(error)
        }
    },
)

// create a master list
masterListController.post(
    '/',
    async (
        req: RequestWithBody<MasterListDto>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const items = await Promise.all(
                req.body.items.map(saveItemDocumentRecursively),
            )
            const itemIds: Types.ObjectId[] = []
            items.forEach(item => item && itemIds.push(item._id))
            const masterList = await (
                await new MasterListModel<IMasterListDocument>({
                    ...req.body,
                    items: itemIds,
                }).save()
            ).populate(POPULATE_ITEMS)

            res.status(201).json(masterList)
        } catch (error) {
            next(error)
        }
    },
)

// update a master list
masterListController.put(
    '/:id',
    async (
        req: RequestWithBody<Partial<MasterListMetadataDto>>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const masterList = await MasterListModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new: true},
            )
            res.json(masterList)
        } catch (error) {
            next(error)
        }
    },
)

// delete a master list
masterListController.delete(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await MasterListModel.findByIdAndDelete(req.params.id)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    },
)

// delete all master lists
masterListController.delete(
    '/',
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            await MasterListModel.deleteMany()
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    },
)

// create item and add it to master list
masterListController.post(
    '/:id/items',
    async (
        req: RequestWithBody<ItemDto>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const masterList = await MasterListModel.findById(req.params.id)
            if (!masterList) {
                res.status(404).send('Master list not found')
                return
            }
            const item = await saveItemDocumentRecursively(req.body)
            if (!item) {
                res.status(400).send('Invalid item data')
                return
            }
            masterList.items.push(item._id)
            await masterList.save()
            res.status(201).json(await item.populate(POPULATE_SUBITEMS))
        } catch (error) {
            next(error)
        }
    },
)

// delete item and remove it from master list
masterListController.delete(
    '/:id/items/:itemId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const masterList = await MasterListModel.findById(req.params.id)
            if (!masterList) {
                res.status(404).send('Master list not found')
                return
            }
            const item = await ItemModel.findById(req.params.itemId)
            if (!item) {
                res.status(404).send('Item not found')
                return
            }
            masterList.items = masterList.items.filter(
                itemId => itemId.toString() !== req.params.itemId,
            )
            await masterList.save()
            await item.deleteOne()
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    },
)

export default masterListController
