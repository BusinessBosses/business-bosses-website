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
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import ChatController from "../controller/ChatController";
import RoutesPath from "../../../constants/Routes";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
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
  const profile = useAppSelector((state) => state.user);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [uniqueChats, setUniqueChats] = useState<Chat[]>([]);
  useEffect(() => {
    setUniqueChats(
      ChatController.reduceDuplicateChats(chats, profile?.profile!)
    );
  }, [chats]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const state = location.state;
    if (!state) {
      navigate(-1);
    } else {
      setChatParty(state.user);
      const filteredMessages = chats.filter(
        (ft) =>
          (ft.senderUid === profile?.profile!.uid &&
            ft.receiverUid === chatParty?.uid) ||
          (ft.senderUid === chatParty?.uid &&
            ft.receiverUid === profile?.profile!.uid)
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
      senderUid: profile?.profile!.uid!,
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
    <div>
      <div className="mobile-only bg-[#f4f4f4] min-h-screen h-full">
        <div
          className="px-4 py-3"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
            borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)}>
                <Assets.Backbutton />
              </button>
              <UserAvatar
                imageSize="w-10 h-10"
                imageURL={
                  chatParty?.photoUrl 
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
        <div className="py-3 px-4">
          {messages.map((message, index) => {
            if (message.image) {
              return (
                <div
                  key={index}
                  className={
                    message.senderUid === profile?.profile!.uid
                      ? "flex justify-end my-5"
                      : "flex justify-start my-5"
                  }
                >
                  <div
                    className={
                      message.senderUid === profile?.profile!.uid
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
                    message.senderUid === profile?.profile!.uid
                      ? "flex justify-end my-5"
                      : "flex justify-start my-5"
                  }
                >
                  <div
                    className={
                      message.senderUid === profile?.profile!.uid
                        ? "bg-primary rounded-b-lg p-2 rounded-tl-lg"
                        : "bg-white shadow rounded-b-lg p-2 rounded-tr-lg"
                    }
                  >
                    <p
                      className={
                        message.senderUid === profile?.profile!.uid
                          ? "text-white"
                          : "text-black"
                      }
                    >
                      {message.messageText}
                    </p>
                  </div>
                </div>
              );
            }
          })}

          <div className="my-14"></div>
          <div ref={scrollRef} />
        </div>
        <div className="fixed bottom-2 w-full">
          <div className="bg-white shadow mx-4 rounded-full p-3 gap-1 flex items-center justify-between">
            <label htmlFor="file" className="cursor-pointer">
              <div className="mr-3">
                <img src={Assets.Gallery} alt="" />
              </div>
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
              className="w-0 h-0 opacity-0 cursor-pointer"
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

      <div className="computer-only bg-[#ffffff] min-h-screen h-full">
        <ComputerHeader />
        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile.profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>

          <div
            className="computer-main-content  "
            style={{ width: "40%", flexGrow: 0 }}
          >
            <div
              className=" bg-white top-0 z-50 px-4 py-5 "
              style={{
                width: "100%",
                flexGrow: 0,
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate(-1)}>
                    <BiArrowBack size={20} />
                  </button>
                  <UserAvatar
                    imageSize="w-10 h-10"
                    imageURL={
                      chatParty?.photoUrl 
                    }
                  />
                  <div className="">
                    <h4 className="text-[#383838] font-bold">
                      {chatParty?.username}
                    </h4>
                    <p className="text-[#6B6969] text-sm">{chatParty?.bio}</p>
                  </div>
                </div>
                <FiMoreVertical />
              </div>
            </div>
            <div
              style={{ borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)" }}
            ></div>
            <div className="py-3 px-4 bg-[#f9f9f9]">
              {messages.map((message, index) => {
                if (message.image) {
                  return (
                    <div
                      key={index}
                      className={
                        message.senderUid === profile?.profile!.uid
                          ? "flex justify-end my-5"
                          : "flex justify-start my-5"
                      }
                    >
                      <div
                        className={
                          message.senderUid === profile?.profile!.uid
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
                        message.senderUid === profile?.profile!.uid
                          ? "flex justify-end my-5"
                          : "flex justify-start my-5"
                      }
                    >
                      <div
                        className={
                          message.senderUid === profile?.profile!.uid
                            ? "bg-primary rounded-b-lg p-2 rounded-tl-lg"
                            : "bg-white shadow rounded-b-lg p-2 rounded-tr-lg"
                        }
                      >
                        <p
                          className={
                            message.senderUid === profile?.profile!.uid
                              ? "text-white"
                              : "text-black"
                          }
                        >
                          {message.messageText}
                        </p>
                      </div>
                    </div>
                  );
                }
              })}

              <div className="my-14"></div>
              <div ref={scrollRef} />
            </div>

            <div className=" fixed bottom-5">
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

          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection ml-5 mt-5 mr-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
             <div className="rounded-xl overflow-hidden" style={{}}>
                {profile.bossup ? (
                  <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
                ) : null}
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
