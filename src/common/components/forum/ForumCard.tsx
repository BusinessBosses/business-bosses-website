import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import FilledButton from "../buttons/FilledButton";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
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
    <div>
      <div className="bg-[#EAEAEA] mobile-only" style={{ paddingTop: 130, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <p>About</p>
            <BsInfoCircle />
          </div>
          <FilledButton
            icon={<AiOutlinePlus color="white" size={20} />}
            onClick={() => { }}
            text="Enter Challenge"
            className="px-3"
          />
        </div>

        <div className="p-3 mt-2 rounded-2xl" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex items-center gap gap-3">
            <img src={banner} alt="" className="w-32 h-20 rounded-lg" />
            <p className="text-[#383838] text-sm">{label}</p>
          </div>
          <div className="flex items-center  justify-between mt-2">
            <div className="flex items-center gap-2 ">
              <FiUsers className="text-primary" />
              <p className="text-primary underline whitespace-nowrap text-sm">
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
              className="bg-white px-6 py-1.5 text-primary rounded-xl " style={{ border: '2px solid', borderColor: 'primary' }}
            >
              {didJoin ? "Leave" : "Join"}
            </button>
          </div>
        </div>
        <div className="bg-[#ffffff] flex items-center justify-between p-2 rounded-lg mt-2">
          <small className="text-xs text-[#545151]">Boss Up by</small>
          <p className="text-[#545151] text-sm">
            Business Bosses Company Limited
          </p>
          <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />
        </div>
      </div>



      <div className="bg-[#f4f4f4] computer-only rounded-2xl p-3 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <p>About</p>
            <BsInfoCircle />
          </div>
          <FilledButton
            icon={<AiOutlinePlus color="white" size={20} />}
            onClick={() => { }}
            text="Enter Challenge"
            className="px-3"
          />
        </div>

        <div className="p-3 mt-2 rounded-2xl" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex items-center gap gap-3">
            <img src={banner} alt="" className="w-32 h-20 rounded-lg" />
            <p className="text-[#383838] text-lg font-bold">{'BossUp'}</p>
          </div>
          <p className="text-[#383838] text-l font-bold pt-5">{label}</p>
          <div className="flex items-center  justify-between mt-2">
            <div className="flex items-center gap-2 ">
              <FiUsers className="text-primary" />
              <p className="text-primary underline whitespace-nowrap text-sm">
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
              className="bg-white px-6 py-1.5 text-primary rounded-xl " style={{ border: '2px solid', borderColor: 'primary' }}
            >
              {didJoin ? "Leave" : "Join"}
            </button>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default ForumCard;
