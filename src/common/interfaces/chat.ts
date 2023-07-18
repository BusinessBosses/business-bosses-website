import { User } from "./user";

export interface Chat {
    messageId: string;
    messageText?: string;
    timestamp: number;
    image?: string;
    isRawImage?: boolean;
    deleted?: string[];
    senderUid: string;
    receiverUid: string;
    seen: boolean;
    marketId?: string;
    user?: User;
}