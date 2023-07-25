import { Comment } from "./comment";
import { User } from "./user";

export interface Forum {
    forumId: string;
    industryId: string;
    description?: string;
    title?: string;
    images?: string[];
    timestamp?: number;
    likes?: string[];
    coins?: string[];
    comments?: Comment[];
    user?: User;
    isRanked?: boolean;
}