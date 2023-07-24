import { useEffect, useRef, useState } from "react";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { FiMoreVertical } from "react-icons/fi";
import Assets from "../../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { User } from "../../../common/interfaces/user";
import { Chat } from "../../../common/interfaces/chat";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import trimText from "../../../common/functions/trimText";
import { removeChat, saveNewChat } from "../../../redux/slices/ChatSlice";
import { v4 } from "uuid";
import serviceApi from "../../../services/serviceApi";
import { Socket } from "socket.io-client";
interface Props {
  socket: Socket;
}
const ChatRoomPage = ({ socket }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatParty, setChatParty] = useState<User | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const chats = useAppSelector((state) => state.chat.chats);
  const messageRef = useRef<HTMLInputElement>(null);
  const profile = useAppSelector((state) => state.user.profile);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
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

  const sendMessage = async (image?: File) => {
    if (!messageRef.current?.value.trim() && !image) return;
    const messageId = v4();
    const body = {
      messageId,
      receiverUid: chatParty?.uid!,
      seen: false,
      senderUid: profile?.uid!,
      timestamp: Date.now(),
      image: image ? URL.createObjectURL(image!) : undefined,
      isRawImage: true,
      messageText: messageRef.current?.value.trim() ?? undefined,
    };
    dispatch(
      saveNewChat({
        ...body,
        user: chatParty!,
      })
    );

    if (image) {
      const response = await serviceApi.uploadFile(image);
      if (response) {
        socket.emit("new-message", {
          data: {
            ...body,
            image: response.fileUrl,
          },
          sender: profile,
        });
      } else {
        const chatIndex = chats.findIndex((fd) => fd.messageId === messageId);
        if (chatIndex !== -1) {
          dispatch(removeChat(chatIndex));
        }
      }
    } else {
      socket.emit("new-message", {
        data: body,
        sender: profile,
      });
    }

    messageRef.current!.value = "";
  };

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
              <p className="text-[#6B6969] text-sm line-clamp-1">
                {trimText(chatParty?.bio ?? "", 20)}
              </p>
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
                <div
                  className={
                    message.senderUid === profile?.uid
                      ? "bg-primary rounded-b-lg p-2 rounded-tl-lg"
                      : "bg-primary rounded-b-lg p-2 rounded-tr-lg"
                  }
                >
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
                <div
                  className={
                    message.senderUid === profile?.uid
                      ? "bg-primary rounded-b-lg p-2 rounded-tl-lg"
                      : "bg-primary rounded-b-lg p-2 rounded-tr-lg"
                  }
                >
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
        <div className="bg-white shadow mx-5 rounded-full p-3 gap-1 flex items-center justify-between">
          <label htmlFor="file">
            <img src={Assets.Gallery} alt="" />
          </label>
          <input
            ref={messageRef}
            type="text"
            placeholder="Type your messages..."
            className="outline-none flex-grow border-none"
            name=""
            id=""
          />
          <input
            onChange={(e) => {
              if (e.target.files?.length) {
                sendMessage(e.target.files[0]);
              }
            }}
            className="w-0 h-0"
            type="file"
            name=""
            id="file"
            accept="images/*"
          />
          <button
            onClick={() => {
              sendMessage();
            }}
          >
            <Assets.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
