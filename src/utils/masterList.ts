// a master list is active if the current time is between the start and end day time plus current time minus offset
export function isActiveMasterList(
    masterList: {
        startDayTimeInMs: number
        endDayTimeInMs: number
    },
    timezoneOffsetInHr: number,
): boolean {
    const now = Date.now()
    const offset = timezoneOffsetInHr * 60 * 60 * 1000
    const dateStr = new Date(now - offset).toISOString().split('T')[0]
    const startTimeInMs =
        new Date(dateStr).getTime() + masterList.startDayTimeInMs + offset
    const endTimeInMs =
        new Date(dateStr).getTime() + masterList.endDayTimeInMs + offset

    return (
        now >= startTimeInMs &&
        now < endTimeInMs &&
        masterList.startDayTimeInMs < masterList.endDayTimeInMs
    )
}
