import express, {NextFunction, Request, Response} from 'express'
import {UserModel} from '../models/user.model'
import {UserDto} from '../dto/user.dto'
import {RequestWithBody} from '../types'

const userController = express.Router()

// get the first user found
userController.get(
    '/',
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            const user = (await UserModel.find())[0]
            if (!user) {
                res.status(404).send('User not found')
                return
            }
            res.json(user)
        } catch (error) {
            next(error)
        }
    },
)

// get user by ID
userController.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await UserModel.findById(req.params.id)
            if (!user) {
                res.status(404).send('User not found')
                return
            }
            res.json(user)
        } catch (error) {
            next(error)
        }
    },
)

// create user
userController.post(
    '/',
    async (
        req: RequestWithBody<UserDto>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = new UserModel(req.body)
            await user.save()
            res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    },
)

// update user
userController.put(
    '/:id',
    async (
        req: RequestWithBody<Partial<UserDto>>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await UserModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                },
            )
            res.json(user)
        } catch (error) {
            next(error)
        }
    },
)

// delete user
userController.delete(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    },
)

export default userController
