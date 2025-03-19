import express, {NextFunction, Request, Response} from 'express'
import {TaskModel} from '../models/task.model'
import {RequestWithBody} from '../types'
import {CheckTaskDto} from '../dto/check-task.dto'

const taskController = express.Router()

// check task
taskController.patch(
    '/:id',
    async (
        req: RequestWithBody<CheckTaskDto>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const task = await TaskModel.findById(req.params.id)
            if (!task) {
                res.status(404).send('Task not found')
                return
            }
            task.done = req.body.done
            if (req.body.done && task.reps)
                task.repsDone = req.body.repsDone || 0
            await task.save()
            res.json(task)
        } catch (error) {
            next(error)
        }
    },
)

export default taskController
