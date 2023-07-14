import React from "react";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { FiMoreVertical } from "react-icons/fi";
import Assets from "../../../assets";

const ChatRoomPage = () => {
  return (
    <div className="bg-[#f4f4f4] min-h-screen h-full">
      <div className="fixed bg-white top-0 w-full z-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar
              imageSize="w-10 h-10"
              imageURL="https://cdn.pixabay.com/photo/2023/06/25/13/19/woman-8087286_640.jpg"
            />
            <div className="">
              <h4 className="text-[#383838] font-bold">Ernest Awuku Junior</h4>
              <p className="text-[#6B6969] text-sm">Bio</p>
            </div>
          </div>
          <FiMoreVertical />
        </div>
      </div>
      <div className="mt-20"></div>
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
