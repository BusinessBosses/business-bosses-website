import React from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";

const ChatPage = () => {
  const navigate = useNavigate();
  return (
    <div>
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
  );
};

export default ChatPage;
