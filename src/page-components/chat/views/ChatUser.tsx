import React from "react";
import RoutesPath from "../../../constants/Routes";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { Chat } from "../../../common/interfaces/chat";
import { useRouter } from "next/navigation";
interface Props {
  chat: Chat;
}
const ChatUser = ({ chat }: Props) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(RoutesPath.ChatRoom, {
          state: {
            user: chat.user,
          },
        });
      }}
      className="flex items-center my-5 gap-3"
    >
      <UserAvatar
        imageURL={
          chat.user?.photoUrl 
        }
      />
      <div className="">
        <h4 className="text-[#383838] text-xl capitalize">
          {chat.user?.username}
        </h4>
        <p className="text-[#6B6969]">
          {!!chat.messageText && chat.messageText !== ""
            ? chat.messageText
            : "Image"}
        </p>
      </div>
    </div>
  );
};

export default ChatUser;
