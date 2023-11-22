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
import ChatUser from "./ChatUser";
import { AiOutlineClose } from "react-icons/ai";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";

interface Props {
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
}

const ChatPage: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const navigate = useNavigate();
  const chats = useAppSelector((state) => state.chat.chats);
  const profile = useAppSelector((state) => state.user);
  const [uniqueChats, setUniqueChats] = useState<Chat[]>([]);
  const [isSearch, setIsSeach] = useState<boolean>(false);

  const [searchResults, setSearchResults] = useState<Chat[]>([]);

  const onSearch = (query: string) => {
    const filteredChats = uniqueChats.filter((ft) =>
      ft.user?.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredChats);
  };

  useEffect(() => {
    setUniqueChats(ChatController.reduceDuplicateChats(chats, profile.profile!));
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
            {isSearch ? (
              <div className="bg-white px-4 py-3 flex gap-3 items-center justify-between">
                <div>
                  <CiSearch size={25} strokeWidth={0.5} onClick={() => { }} />
                </div>
                <div className="flex-grow ">
                  <input
                    onChange={(event) => {
                      onSearch(event.target.value.trim());
                    }}
                    type="text"
                    placeholder="search chats"
                    className="w-full outline-none border-none"
                  />
                </div>
                <button onClick={() => setIsSeach(false)}>
                  <AiOutlineClose
                    size={25}
                    strokeWidth={0.5}
                    onClick={() => { }}
                  />
                </button>
              </div>
            ) : (
              <div className="bg-white px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)}>
                  <Assets.Backbutton />
                </button>
                <div className="flex-grow text-center">
                  <p className="text-md font-semibold">Chats</p>
                </div>
                <button onClick={() => setIsSeach(true)}>
                  <CiSearch size={25} strokeWidth={0.5} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="px-4">
          {isSearch
            ? searchResults.map((chat, index) => {
              return <ChatUser key={index} chat={chat} />;
            })
            : uniqueChats.map((chat, index) => {
              return <ChatUser key={index} chat={chat} />;
            })}
        </div>
      </div>

      <div className="computer-only">
        <ComputerHeader partnerData={partnerData} partnerDatatile={partnerDatatile} />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5 pl-0"
            style={{
              width: "25%",
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
            className="computer-main-content p-5"
            style={{ width: "50%", flexGrow: 0 }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              <div className="text-lg font-semibold text-[#333333]">
                Chats
              </div>

              <div className="">
                {uniqueChats.length === 0 ? (
                  <div className="text-center flex justify-center items-center pb-40" style={{ height: '100vh' }}>
                    <div>
                      <div className="font-bold">No Chats Found</div>
                      <div>Search for friends or connections and chat with them</div>
                    </div>
                  </div>

                ) : (
                  uniqueChats.map((chat, index) => (
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
                          chat.user?.photoUrl
                        }
                      />
                      <div className="">
                        <h2 className="text-[#383838] text-base font-bold capitalize">
                          {chat.user?.username}
                        </h2>
                        <p className="text-[#6B6969]">
                          {chat.messageText && chat.messageText !== ""
                            ? chat.messageText.length > 30
                              ? chat.messageText.slice(0, 30) + "..." // Truncate and add ellipsis
                              : chat.messageText
                            : "Image"}
                        </p>

                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mt-5  mr-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} partnerData={partnerData} partnerDatatile={partnerDatatile} />
              ) : null}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
