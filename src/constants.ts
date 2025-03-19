export const POPULATE_ITEMS = {
    path: 'items',
    populate: {path: 'subItems', populate: 'subItems'},
}

export const POPULATE_SUBITEMS = {
    path: 'subItems',
    populate: {path: 'subItems', populate: 'subItems'},
}

export const POPULATE_TASKS = {
    path: 'tasks',
    populate: {path: 'subTasks', populate: 'subTasks'},
}

export const POPULATE_SUBTASKS = {
    path: 'subTasks',
    populate: {path: 'subTasks', populate: 'subTasks'},
}
