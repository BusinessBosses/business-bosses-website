import React, { useEffect, useRef, useState } from "react";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { FiMoreVertical } from "react-icons/fi";
import Assets from "../../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { User } from "../../../common/interfaces/user";
import { Chat } from "../../../common/interfaces/chat";
import { useAppSelector } from "../../../redux/store/store";

const ChatRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatParty, setChatParty] = useState<User | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const chats = useAppSelector((state) => state.chat.chats);
  const profile = useAppSelector((state) => state.user.profile);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const state = location.state;
    if (!state) {
      navigate(-1);
    } else {
      setChatParty(state.user);
      const filteredMessages = chats.filter(
        (ft) =>
          (ft.senderUid === profile?.uid &&
            ft.receiverUid === chatParty?.uid) ||
          (ft.senderUid === chatParty?.uid && ft.receiverUid === profile?.uid)
      );
      setMessages(filteredMessages);
    }
  }, [chats, chatParty]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="bg-[#f4f4f4] min-h-screen h-full">
      <div className="fixed bg-white top-0 w-full z-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <BiArrowBack size={20} />
            </button>
            <UserAvatar
              imageSize="w-10 h-10"
              imageURL={
                chatParty?.photoUrl ??
                "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
            />
            <div className="">
              <h4 className="text-[#383838] font-bold capitalize">
                {chatParty?.username}
              </h4>
              <p className="text-[#6B6969] text-sm">{chatParty?.bio}</p>
            </div>
          </div>
          <FiMoreVertical />
        </div>
      </div>
      <div className="mt-20 py-5 px-5">
        {messages.map((message, index) => {
          if (message.image) {
            return (
              <div
                key={index}
                className={
                  message.senderUid === profile?.uid
                    ? "flex justify-end my-5"
                    : "flex justify-start my-5"
                }
              >
                <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
                  <img
                    src={message.image}
                    className="w-44 h-44 rounded-lg"
                    alt=""
                  />
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className={
                  message.senderUid === profile?.uid
                    ? "flex justify-end my-5"
                    : "flex justify-start my-5"
                }
              >
                <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
                  <p className="text-white">{message.messageText}</p>
                </div>
              </div>
            );
          }
        })}

        <div className="my-14"></div>
        <div ref={scrollRef} />
      </div>
      <div className="fixed bottom-2 w-full">
        <div className="bg-white shadow mx-5 rounded-full p-3 flex items-center justify-between">
          <input
            type="text"
            placeholder="Type your messages..."
            className="outline-none flex-grow border-none"
            name=""
            id=""
          />
          <button>
            <Assets.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
