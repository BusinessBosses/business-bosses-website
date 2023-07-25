import { Disconnection } from "./disconnection"
import { Industry } from "./industry"
import { ProfileView } from "./profileView"
import { Referals } from "./referals"

export interface User {
    uid: string
    username: string
    email: string
    timestamp?: number
    bossOfTheWeekTimeStamp?: number
    bossOfTheWeekUpTimeStamp?: number
    photoUrl?: string
    coinscount?: number
    name?: string
    companyName?: string
    surname?: string
    bio?: string
    website?: string
    instagram?: string
    twitter?: string
    industry?: string
    category?: string
    location?: string
    achievements?: string[]
    interests: Industry[]
    productsandservices?: string[]
    referals: Referals[]
    invitations?: number
    disconnections?: Disconnection[]
    active?: boolean
    deactivated?: boolean
    ageRange?: string
    gender?: string
    profileViews?: ProfileView[]
    connectionCount?: number
    connectedCount?: number
    unReadCount?: number
    isRanked?: boolean
    connections?: string[]
    connecteds?: string[]
    referalCount?: number
    inviteId?: string
    averageRating?: number
    isSubscribed?: boolean

}

