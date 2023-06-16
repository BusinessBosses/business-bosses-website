import React from "react";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import Assets from "../../../../assets";

const PostItem = () => {
  return (
    <div className="my-10">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar imageURL="https://cdn.pixabay.com/photo/2023/06/02/14/12/woman-8035772_640.jpg" />
          <div className="">
            <p className="text-[#333333] text-lg">Isaac Akin</p>
            <p className="text-sm text-[#777777]">Supplier of survey</p>
          </div>
        </div>
        <IoIosMore size={20} />
      </div>
      <div className="mt-2">
        <p className="text-sm text-[#303133]">
          For you to be effective at networking you should make it a hobby
        </p>
        <div className="mt-2">
          <img
            src="https://cdn.pixabay.com/photo/2023/01/05/13/42/roses-7698973__340.jpg"
            alt=""
            className="rounded-lg w-full h-64 object-cover"
          />
          <div className="flex overflow-x-scroll mt-2 hide-scroll-bar">
            <div className="flex flex-nowrap gap-2">
              {[1, 2, 3, 4, 5].map((img) => (
                <div key={img} className="inline-block">
                  <div className="w-20 h-20 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <img
                      src="https://cdn.pixabay.com/photo/2023/01/05/13/42/roses-7698973__340.jpg"
                      alt=""
                      className="rounded-lg w-20 h-20 object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-5">
            <PostAction count="2" icon={Assets.Like} onClick={() => {}} />
            <PostAction count="5" icon={Assets.Comment} onClick={() => {}} />
            <PostAction count="2" icon={Assets.Coin} onClick={() => {}} />
            <PostAction count="2" icon={Assets.Share} onClick={() => {}} />
          </div>
          <small className="text-[#B4B4B4]">6 days ago</small>
        </div>
      </div>
    </div>
  );
};

export default PostItem;

interface PostActionProps {
  icon: any;
  count: string;
  active?: boolean;
  onClick: VoidFunction;
}
const PostAction = ({ count, icon, active, onClick }: PostActionProps) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onClick}>
        <img src={icon} alt="" />
      </button>
      <p className="text-sm">{count}</p>
    </div>
  );
};
