import {ITask, ITaskDocument} from '../types/ITask'
import {HydratedDocument, Types} from 'mongoose'
import {TaskModel} from '../models/task.model'
import {IItem} from '../types/IItem'

export function generateTaskFromItem(item: IItem): ITask {
    return {
        name: item.name,
        done: false,
        score: item.score,
        mandatory: item.mandatory,
        expandedFormat: item.expandedFormat,
        reps: item.reps,
        subTasks: item.subItems.flatMap(subItem =>
            !subItem.instances.length
                ? generateTaskFromItem(subItem)
                : generateTasksFromItemInstances(subItem),
        ),
    }
}

export function generateTasksFromItemInstances(item: IItem): ITask[] {
    return item.instances.map(instance => ({
        name: instance,
        done: false,
        score: item.score,
        mandatory: item.mandatory,
        expandedFormat: item.expandedFormat,
        reps: item.reps,
        subTasks: item.subItems.flatMap(subItem =>
            !subItem.instances.length
                ? generateTaskFromItem(subItem)
                : generateTasksFromItemInstances(subItem),
        ),
    }))
}

export function calculateTotalTaskScore(task: ITask): number {
    let totalScore = 0
    if (task.subTasks.length === 0) {
        return (task.done && task.score) || 0
    }
    for (const subTask of task.subTasks) {
        totalScore += calculateTotalTaskScore(subTask)
    }
    return totalScore
}

export async function saveTaskDocumentRecursively(
    taskData: ITask,
): Promise<HydratedDocument<ITaskDocument> | undefined> {
    try {
        const subTaskIds: Types.ObjectId[] = []
        if (taskData.subTasks) {
            const subTasks = await Promise.all(
                taskData.subTasks.map(subTask =>
                    saveTaskDocumentRecursively(subTask),
                ),
            )
            subTasks.forEach(subTask => subTask && subTaskIds.push(subTask._id))
        }
        const task = await new TaskModel<ITaskDocument>({
            ...taskData,
            subTasks: subTaskIds,
        }).save()
        return task
    } catch (error) {
        console.error(error)
        return undefined
    }
}
