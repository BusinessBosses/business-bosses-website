import { User } from "./user";

export interface NotificationProp {
    notificationId: string;
    dataId?: string;
    senderUid: string;
    message: string;
    title: string;
    timestamp: number;
    receiverUid: string;
    isRead: boolean;
    notificationType?: string;
    username?: string;
    user?: User;
}