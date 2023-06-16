import { AiOutlinePlus } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import { BsInfoCircle } from "react-icons/bs";

const MobileMarketIntro = () => {
  return (
    <div className="bg-[#EAEAEA] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p>Guidelines</p>
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
          <img
            src="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
            alt=""
            className="w-32 h-20 rounded-lg"
          />
          <p className="text-[#383838] text-sm">
            Ideas on how to create things easily
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <FiUsers className="text-primary" />
            <p className="text-primary underline text-sm">Members: (3)</p>
          </div>
          <p className="text-sm text-[#232324]"># Listing (48)</p>
          <button className="bg-white px-6 py-2 text-primary rounded-lg shadow-lg">
            Join
          </button>
        </div>
      </div>
      <div className="bg-[#F4F4F4] flex items-center justify-between p-2 rounded-lg mt-2">
        <small className="text-xs text-[#545151]">Boss Up by</small>
        <p className="text-[#545151] text-sm">
          Business Bosses Company Limited
        </p>
        <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />
      </div>
    </div>
  );
};

export default MobileMarketIntro;
