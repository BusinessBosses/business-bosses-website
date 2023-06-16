import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import FilledButton from "../buttons/FilledButton";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
interface Props {
  banner: string;
  label: string;
  members: number;
  topics: number;
  didJoin: boolean;
  onJoin: VoidFunction;
}
const ForumCard = ({
  banner,
  didJoin,
  label,
  members,
  onJoin,
  topics,
}: Props) => {
  return (
    <div className="bg-[#EAEAEA] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p>About</p>
          <BsInfoCircle />
        </div>
        <FilledButton
          icon={<AiOutlinePlus color="white" size={20} />}
          onClick={() => {}}
          text="Sell"
          className="px-12"
        />
      </div>

      <div className="bg-marketLinear p-3 mt-2 rounded-lg">
        <div className="flex gap-3">
          <img src={banner} alt="" className="w-32 h-20 rounded-lg" />
          <p className="text-[#383838] text-sm">{label}</p>
        </div>
        <div className="flex items-center  justify-between mt-2">
          <div className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
            <FiUsers className="text-[#FFFFFFCC]" />
            <p className="text-[#FFFFFFCC] whitespace-nowrap text-sm">
              Members: ({members.toString()})
            </p>
          </div>
          <div className="bg-[#FFFFFF1A] whitespace-nowrap px-3 py-1 rounded-full">
            <p className="text-sm text-[#232324]">
              # Entries ({topics.toString()})
            </p>
          </div>
          <button
            onClick={onJoin}
            className="bg-white px-6 py-2  rounded-lg shadow-lg"
          >
            {didJoin ? "Leave" : "Join"}
          </button>
        </div>
      </div>
      <div className="bg-[#F4F4F4] flex items-center justify-between p-2 rounded-lg mt-2">
        <small className="text-xs text-[#545151]">Boss Up by</small>
        <p className="text-[#545151] text-sm">
          Business Bosses Company Limited
        </p>
      </div>
    </div>
  );
};

export default ForumCard;
