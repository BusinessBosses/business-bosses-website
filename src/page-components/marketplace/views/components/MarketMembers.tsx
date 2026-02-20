import React from "react";
import Popup from "reactjs-popup";
import { User } from "../../../../common/interfaces/user";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import trimText from "../../../../common/functions/trimText";
import Assets from "../../../../assets";
interface Props {
  members: User[];
  onClose: VoidFunction;
  open: boolean;
}
const MarketMembers = ({ members, onClose, open }: Props) => {
  return (
    <Popup onClose={onClose} lockScroll open={open} modal>
      <div className="bg-white h-screen md:my-10 shadow-2xl w-screen overflow-y-scroll rounded-lg md:w-[70vh]">
        <div className="flex items-center gap-10 p-5">
          <button className="outline-none" onClick={onClose}>
            <Assets.Backbutton />
          </button>
          <p className="text-md font-semibold">Marketplace Members</p>
        </div>
        <div className="px-5">
          {members.map((member, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-3 py-5 border-b-[0.5px] border-b-[#f1f1f1]"
              >
                <UserAvatar />
                <div className="">
                  <p className="text-[#333333] font-bold md:text-lg text-xs capitalize">
                    {member.username}
                  </p>
                  <p className="md:text-sm text-xs text-[#777777]">
                    {trimText(member.bio ?? "", 40)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Popup>
  );
};

export default MarketMembers;
