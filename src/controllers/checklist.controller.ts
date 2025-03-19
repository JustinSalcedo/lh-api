import express, {NextFunction, Request, Response} from 'express'
import {UserModel} from '../models/user.model'
import {MasterListModel} from '../models/master-list.model'
import {ChecklistModel} from '../models/checklist.model'
import {
    calculateNewUserStatsWithChecklist,
    generateChecklistFromMasterList,
    isActiveChecklist,
} from '../utils/checklist'
import {IChecklistDocument} from '../types/IChecklist'
import {Types} from 'mongoose'
import {isActiveMasterList} from '../utils/masterList'
import {saveTaskDocumentRecursively} from '../utils/task'
import {POPULATE_ITEMS, POPULATE_TASKS} from '../constants'

const checklistController = express.Router()

// get user's current checklist
checklistController.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await UserModel.findById(req.params.id)
            if (!user) {
                res.status(404).json({message: 'User not found'})
                return
            }

            const currentChecklistId = user.currentChecklist
            const currentChecklist = await ChecklistModel.findById(
                currentChecklistId,
            )
            if (currentChecklist && isActiveChecklist(currentChecklist)) {
                res.json(
                    await currentChecklist.populate([POPULATE_TASKS, 'user']),
                )
                return
            }
            if (currentChecklist && !currentChecklist.processed) {
                const {totalScore, xp, multiplier, reward, balance} =
                    calculateNewUserStatsWithChecklist(
                        user,
                        await currentChecklist.populate([
                            POPULATE_TASKS,
                            'user',
                        ]),
                    )
                await UserModel.findByIdAndUpdate(req.params.id, {
                    totalScore,
                    xp,
                    balance,
                    multiplier,
                })
                await currentChecklist.updateOne({processed: true, reward})
            }

            const masterList = (await MasterListModel.find())[0]
            if (!masterList) {
                res.status(404).json({message: 'Master list not found'})
                return
            }

            if (
                !isActiveMasterList(masterList, user.timezoneOffsetInHr) &&
                currentChecklist
            ) {
                res.json(
                    await currentChecklist.populate([POPULATE_TASKS, 'user']),
                )
                return
            }

            const newChecklistData = generateChecklistFromMasterList(
                await masterList.populate(POPULATE_ITEMS),
                user.timezoneOffsetInHr,
            )
            const tasks = await Promise.all(
                newChecklistData.tasks.map(saveTaskDocumentRecursively),
            )
            const taskIds: Types.ObjectId[] = []
            tasks.forEach(task => task && taskIds.push(task._id))
            const newChecklist = await new ChecklistModel<IChecklistDocument>({
                ...newChecklistData,
                user: user._id,
                tasks: taskIds,
            }).save()

            // update user current checklist and push to checklists array
            await UserModel.findByIdAndUpdate(req.params.id, {
                currentChecklist: newChecklist._id,
                $push: {checklists: newChecklist._id},
            })

            res.status(201).json(
                await newChecklist.populate([POPULATE_TASKS, 'user']),
            )
        } catch (error) {
            next(error)
        }
    },
)

// delete all checklists
checklistController.delete(
    '/',
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            await ChecklistModel.deleteMany()
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    },
)

export default checklistController
