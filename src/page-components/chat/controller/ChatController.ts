import { Chat } from "../../../common/interfaces/chat";
import { User } from "../../../common/interfaces/user";

class ChatController {
    reduceDuplicateChats(chats: Chat[], profile: User): Chat[] {
        const uniqueChatsFn = [...chats]
            .reverse()
            .reduce((uniqueChats: any, chat: Chat) => {
                const chatPartnerId =
                    chat.senderUid === profile!.uid ? chat.receiverUid : chat.senderUid;

                const existingChat = uniqueChats.find(
                    (chat: any) =>
                        chat.senderUid === chatPartnerId ||
                        chat.receiverUid === chatPartnerId
                );

                if (!existingChat) {
                    uniqueChats.push(chat);
                }

                return uniqueChats;
            }, []);

        return uniqueChatsFn;
    }
}



export default new ChatController()