import React, { ReactNode } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ChatRoomPage from "./ChatRoomPage";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";

const ChatPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mobile-only">
        <div className="fixed top-0 w-full z-50">
          <CommonPageHeader title="Chat" />
        </div>
        <div className="mt-20 px-5">
          <div
            onClick={() => {
              navigate(RoutesPath.ChatRoom);
            }}
            className="flex items-center gap-3"
          >
            <UserAvatar imageURL="https://cdn.pixabay.com/photo/2023/06/25/13/19/woman-8087286_640.jpg" />
            <div className="">
              <h4 className="text-[#383838] text-xl">Ernest Awuku Junior</h4>
              <p className="text-[#6B6969]">message here</p>
            </div>
          </div>
        </div>
      </div>

      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection ml-40 mr-5" style={{
            width: '30%',

            flexGrow: 0,
            overflow: 'scroll',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: '100%'

          }} >
            <div className="flex items-center " onClick={() => navigate(RoutesPath.myProfile)}>

              <UserAvatar
                imageSize="h-24 w-24"
                imageURL="https://cdn.pixabay.com/photo/2023/06/12/07/15/spider-8057853__340.jpg"
              />
              <div className="ml-4">
                <p className="text-xl font-semibold">Isaac Akin</p>
                <p className="text-lg font-medium">Consultant</p>
                <p className="font-medium">Digital Blogger</p>
                <p className="text-sm font-light text-[#A9A9A9]">United Kingdom</p>
              </div>
              <div className="flex-grow" />
              <Popup
                trigger={
                  <div>
                    <IoIosMore size={20} />
                  </div>
                }
                position="left top"
                on="click"
                closeOnDocumentClick
                contentStyle={{ padding: "0px", border: "none" }}
              // arrow={false}
              >
                {
                  (((close: any) => (
                    <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                      <button
                        onClick={() => {
                          close();
                        }}
                        className="menu-item"
                      >
                        Hide
                      </button>
                      <button
                        onClick={() => {
                          close();
                        }}
                        className="menu-item"
                      >
                        Report
                      </button>
                    </div>
                  )) as unknown) as ReactNode
                }
              </Popup>


            </div>
          </div>
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" style={{ width: '40%', flexGrow: 0 }} >
            <ChatRoomPage />

          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-40 mb-40" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: '100%'
          }}>
            <div className="" >
              <CommonPageHeader title="Chat" />
              <div className="">
                <div
                  onClick={() => {
                    navigate(RoutesPath.ChatRoom);
                  }}
                  className="flex items-center gap-3"
                >
                  <UserAvatar imageURL="https://cdn.pixabay.com/photo/2023/06/25/13/19/woman-8087286_640.jpg" />
                  <div className="">
                    <h4 className="text-[#383838] text-xl">Ernest Awuku Junior</h4>
                    <p className="text-[#6B6969]">message here</p>
                  </div>

                </div>

              </div>
            </div>


          </div>






        </div>



      </div>
    </div>
  );
};

export default ChatPage;
