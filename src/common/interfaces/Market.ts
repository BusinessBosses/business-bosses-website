import { Comment } from "./comment";
import { User } from "./user";

export interface Market {
    marketId: string;
    category?: string;
    location?: string;
    description: string;
    userId: string;
    images?: string[];
    price: string;
    user?: User;
    promote: boolean;
    timestamp?: number;
    likes: string[];
    coins?: string[];
    comments?: Comment[];
    views?: number;
    discount?: string;
}