export interface UserDto {
    name: string
    timezoneOffsetInHr: number
    level?: number
    totalScore?: number
    xp?: number
    multiplier?: number
    maxMultiplier: number
    balance?: number
    // masterList: string
}
