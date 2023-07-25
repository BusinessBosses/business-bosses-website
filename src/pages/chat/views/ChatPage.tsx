import React, { useEffect, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";
import ChatController from "../controller/ChatController";
import { Chat } from "../../../common/interfaces/chat";

const ChatPage = () => {
  const navigate = useNavigate();
  const chats = useAppSelector((state) => state.chat.chats);
  const profile = useAppSelector((state) => state.user.profile);
  const [uniqueChats, setUniqueChats] = useState<Chat[]>([]);

  useEffect(() => {
    setUniqueChats(ChatController.reduceDuplicateChats(chats, profile!));
  }, [chats]);
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Chat" />
      </div>
      <div className="mt-20 px-5">
        {uniqueChats.map((chat, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                navigate(RoutesPath.ChatRoom, {
                  state: {
                    user: chat.user,
                  },
                });
              }}
              className="flex items-center my-5 gap-3"
            >
              <UserAvatar
                imageURL={
                  chat.user?.photoUrl ??
                  "https://cdn-icons-png.flaticon.com/128/149/149071.png"
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
        })}
      </div>
    </div>
  );
};

export default ChatPage;
