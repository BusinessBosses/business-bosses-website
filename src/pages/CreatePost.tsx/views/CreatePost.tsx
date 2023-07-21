import React from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import Assets from "../../../assets";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import ComputerHeader from "../../home/views/components/ComputerHeader";

const CreatePost = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mobile-only">
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Create Post" />
      </div>
      <div className="my-20"></div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <UserAvatar imageURL="https://cdn.pixabay.com/photo/2023/06/03/16/05/spotted-laughingtrush-8037974__340.png" />
          <p className="text-[#333333] text-lg font-medium">Isaac Akin</p>
        </div>

        <div className=" mt-7">
          <textarea
            name=""
            id=""
            placeholder="What’s on your mind?"
            className="w-full outline-none border-[1px] border-[#EAEAEA] placeholder:text-[#A9A9A9] rounded-lg p-3 text-sm resize-none bg-[#F4F4F4]"
            rows={8}
          ></textarea>

          <div className="flex mt-4 items-center gap-3">
            <p className="text-[#333333]">Add Image</p>
            <button className="bg-[#F4F4F4] p-2.5 rounded-full">
              <img src={Assets.Gallery} alt="" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-5">
            <img src={Assets.Rocket} alt="" />
            <p className="text-[#373737] font-semibold">Boost Post</p>
            <MdOutlineKeyboardArrowRight size={24} className="text-primary" />
          </div>
          <div className="mt-10">
            <FilledButton
              onClick={() => {
                navigate(RoutesPath.promotePost);
              }}
              text="Post"
              className="w-full py-3"
            />
          </div>
        </div>
      </div>

      </div>
     


    
    </div>
  );
};

export default CreatePost;
