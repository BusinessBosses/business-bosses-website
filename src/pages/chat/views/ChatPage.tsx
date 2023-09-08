import React, { useEffect, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";
import ChatController from "../controller/ChatController";
import { Chat } from "../../../common/interfaces/chat";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import ChooseTile from "../../communities/views/choosetile";
import Assets from "../../../assets";
import { CiSearch } from "react-icons/ci";

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
      <div className="mobile-only">
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
            borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)",
          }}
        >
           <div className="mobile-only">
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <Assets.Backbutton />
          </button>
          <div className="flex-grow text-center">
            <p className="text-md font-semibold">Chats</p>
          </div>
          <div><CiSearch size={25} strokeWidth={0.5} onClick={()=>{}}/></div> 
        </div>
      </div>
        </div>
        <div className="px-4">
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

      <div className="computer-only">
        <ComputerHeader />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5 pl-0"
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
                <ComputerProfileDetails data={profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>

          <div
            className="computer-main-content p-5"
            style={{ width: "40%", flexGrow: 0 }}
          >
             <ChooseTile />
          </div>

          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection ml-5 mr-5 lg:mr-20 pr-0 mb-0"
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
              <div className="mt-5 text-lg font-semibold text-[#333333]">Chats</div>
              
              <div className="">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
