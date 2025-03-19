import {IChecklist} from '../types/IChecklist'
import {IMasterList} from '../types/IMasterList'
import {IUser} from '../types/IUser'
import {
    calculateTotalTaskScore,
    generateTaskFromItem,
    generateTasksFromItemInstances,
} from './task'

export function generateChecklistFromMasterList(
    masterList: IMasterList,
    timezoneOffsetInHr: number,
): Omit<IChecklist, 'user'> {
    const date = new Date()
    const offset = timezoneOffsetInHr * 60 * 60 * 1000
    const dateStr = new Date(date.getTime() - offset)
        .toISOString()
        .split('T')[0]
    const startTimeInMs =
        new Date(dateStr).getTime() + masterList.startDayTimeInMs + offset
    const endTimeInMs =
        new Date(dateStr).getTime() + masterList.endDayTimeInMs + offset

    return {
        dateStr,
        score: 0,
        tasks: masterList.items.flatMap(item =>
            !item.instances.length
                ? generateTaskFromItem(item)
                : generateTasksFromItemInstances(item),
        ),
        startTimeInMs,
        endTimeInMs,
        processed: false,
    }
}

interface IStats {
    totalScore: number
    xp: number
    multiplier: number
    reward: number
    balance: number
}

export function calculateNewUserStatsWithChecklist(
    user: Omit<IUser, 'checklists' | 'currentChecklist'>,
    checklist: IChecklist,
): IStats {
    const multiplier = user.multiplier
    const checklistScore = checklist.tasks.reduce(
        (acc, task) => acc + calculateTotalTaskScore(task),
        0,
    )
    const reward = checklistScore * multiplier
    const totalScore = user.totalScore + reward
    const xp = user.xp + checklistScore
    const balance = user.balance + reward

    return {
        totalScore,
        xp,
        multiplier,
        reward,
        balance,
    }
}

// a checklist is active if the current time is between the start and end time
export function isActiveChecklist(checklist: {
    startTimeInMs: number
    endTimeInMs: number
}): boolean {
    const now = new Date().getTime()
    return now >= checklist.startTimeInMs && now < checklist.endTimeInMs
}
