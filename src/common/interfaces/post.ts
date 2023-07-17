import { Comment } from "./comment"
import { User } from "./user"

export interface Post {


    postId: string
    title: string
    images?: string[]
    timestamp: number
    likes: string[]
    coins: string[]
    comments: Comment[]
    user: User
    videoUrl?: string
    isRanked: boolean
    promote?: boolean
    promotionDuration: any
    plan?: string
    approved?: boolean
}




