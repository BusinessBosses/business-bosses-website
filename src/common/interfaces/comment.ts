import { User } from "./user";

export interface Comment {
    commentId?: string;
    userId?: string;
    postId?: string;
    comment?: string;
    timestamp?: number;
    user: User
}