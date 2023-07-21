import React from "react";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { FiMoreVertical } from "react-icons/fi";
import Assets from "../../../assets";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const ChatRoomPage = () => {
  const navigate = useNavigate();
  return (
    <div>
    <div className="mobile-only bg-[#f4f4f4] min-h-screen h-full">
      <div className="fixed bg-white top-0 w-full z-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <BiArrowBack size={20} />
            </button>
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
      <div className="mt-20 py-5 px-5">
        <div className="flex justify-end my-5">
          <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
            <p className="text-white">hi</p>
          </div>
        </div>
        <div className="flex justify-end my-5">
          <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
            <img
              src="https://cdn.pixabay.com/photo/2023/07/08/09/53/monastery-8114076_640.jpg"
              className="w-44 h-44 rounded-lg"
              alt=""
            />
          </div>
        </div>
        <div className="flex justify-end my-5">
          <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
            <p className="text-white">wadup</p>
          </div>
        </div>
        <div className="flex justify-end my-5">
          <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
            <p className="text-white">hi</p>
          </div>
        </div>
        <div className="flex justify-end my-5">
          <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
            <p className="text-white">hi</p>
          </div>
        </div>
        <div className="flex justify-end my-5">
          <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
            <p className="text-white">hi</p>
          </div>
        </div>
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



    <div className="computer-only bg-[#f4f4f4] min-h-screen h-full">
      <div className=" bg-white top-0 z-50 px-5 py-5 mt-5" style={{
        width: '100%',
        flexGrow: 0,
        position: 'sticky',
        top: 0,
        zIndex: 1,
       
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <BiArrowBack size={20} />
            </button>
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
      <div style={{ borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
      <div className="mt-20 py-5 px-5">
        <div className="flex justify-end my-5">
          <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
            <p className="text-white">hi</p>
          </div>
        </div>
        <div className="flex justify-end my-5">
          <div className="bg-primary rounded-b-lg p-2 rounded-tl-lg">
            <img
              src="https://cdn.pixabay.com/photo/2023/07/08/09/53/monastery-8114076_640.jpg"
              className="w-44 h-44 rounded-lg"
              alt=""
            />
          </div>
        </div>
        
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









    </div>
  );
};

export default ChatRoomPage;
