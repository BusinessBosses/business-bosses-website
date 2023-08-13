import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import FilledButton from "../buttons/FilledButton";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import Assets from "../../../assets";
import BossupPartnerstile from "../../../pages/home/views/components/BopssupPartnerstile";
import FilledButtonsmall from "../buttons/FilledButtonsmall";
interface Props {
  banner: string;
  label: string;
  members: number;
  topics: number;
  didJoin: boolean;
  onJoin: VoidFunction;
  createLabel: string;
  onCreate: VoidFunction;
  aboutontap: VoidFunction;
  aboutontaptext: string;
  topicsicon: React.ReactNode;
  topicstext: string;
}
const ForumCard = ({
  banner,
  didJoin,
  label,
  members,
  onJoin,
  topics,
  createLabel,
  onCreate,
  aboutontap,
  aboutontaptext,
  topicsicon,
  topicstext,
}: Props) => {
  return (
    <div>
      <div className="bg-[#EAEAEA] px-4 py-3 mobile-only">
        <div className="flex items-center justify-between">
          <div onClick={aboutontap} className="flex items-center text-xs gap-1">
            <p className="font-bold">{aboutontaptext}</p>
            <BsInfoCircle size={18} />
          </div>
          <FilledButtonsmall
            icon={<AiOutlinePlus color="white" size={20} />}
            onClick={onCreate}
            text={createLabel}
            className="px-3 py-3"
          />
        </div>

        <div className="bg-[#ffffff] p-3 mt-2 rounded-xl">
          <div className="flex gap-3 items-center">
            <img src={banner} alt="" className="w-32 h-20 rounded-lg" />
            <p className="text-[#383838] text-sm font-bold mr-10">{label}</p>
          </div>
          <div className="flex items-center  justify-between mt-2">
            <div className="flex items-center gap-1">
              <Assets.Membersicon className="text-primary" stroke="white" />
              <p className="text-primary underline text-sm font-bold">Members ({members.toString()})</p>

            </div>
            <div className="bg-[#FFFFFF1A]  flex whitespace-nowrap px-3 py-1 rounded-full items-center gap-1">
              {topicsicon}
              <p className="text-sm text-[#232324] font-bold">
                {`${topicstext} (${topics.toString()})`}
              </p>
            </div>
            <button
              onClick={onJoin}
              className="bg-white px-6 py-1.5 rounded-xl"
              style={{
                border: `2px solid ${didJoin ? "#a9a9a9" : "#F21C29"}`,
                color: didJoin ? "#a9a9a9" : "#F21C29"
              }}
            >
              {didJoin ? "Leave" : "Join"}
            </button>

          </div>
        </div>
        <div className="mobile-only">
          <BossupPartnerstile bossupby={""} bossupad={""} />
        </div>
      </div>




      <div>


        <div className="bg-[#f4f4f4] p-3 computer-only rounded-2xl">


          <div className="bg-[#ffffff] p-3 rounded-lg">
            <div className="flex gap-3">
              <img src={banner} alt="" className="w-32 h-20 rounded-lg" />
              <p className="text-[#383838] text-sm">{label}</p>
            </div>
            <div className="flex items-center  justify-between mt-2">
            <div className="flex items-center gap-1">
              <Assets.Membersicon className="text-primary" stroke="white" />
              <p className="text-primary underline text-sm font-bold">Members ({members.toString()})</p>

            </div>
              <div className="bg-[#FFFFFF1A]  flex whitespace-nowrap px-3 py-1 rounded-full items-center gap-1">
                {topicsicon}
                <p className="text-sm text-[#232324] font-bold">
                  {`${topicstext} (${topics.toString()})`}
                </p>
              </div>
              <button
                onClick={onJoin}
                className="bg-white px-6 py-1.5 text-primary rounded-xl "
                style={{ border: "2px solid", borderColor: "primary" }} // Add the border style here
              >
                {didJoin ? "Leave" : "Join"}
              </button>
            </div>
          </div>
          <div className="mobile-only"><div className="bg-[#ffffff] flex items-center justify-between p-2 rounded-lg mt-2">
            <div className="flex items-center">
              <small className="text-xs text-[#545151] pr-2" style={{ paddingRight: 10, borderRight: '1.2px solid rgba(0, 0, 0, 0.5)' }}>
                Boss Up by
              </small>
              <p className="text-[#545151] text-sm pl-2" >Business Bosses Company Limited </p>
            </div>
            <Assets.Nexticon className="text-[#726F6F]" />
          </div>
          </div>
        </div>
      </div>




    </div>
  );
};

export default ForumCard;
