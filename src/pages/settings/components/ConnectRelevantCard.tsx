import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FilledButton from "../../../common/components/buttons/FilledButton";

const ConnectRelevantCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow pt-4 rounded-xl">
      <div className="flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/128/149/149071.png"
          alt="Profile"
          className="w-12 h-12 rounded-full mb-3"
        />
        <div className="text-center">
          <p className="text-lg font-semibold">Name</p>
          <p className="text-gray-500">Learning</p>
        </div>
        <div className="pt-2 pb-4">
        <FilledButton
              onClick={() => { }}
              text="Connect"
              className="px-5 py-1.5"
            />
        </div>
        
      </div>
      
    </div>
  );
};

export default ConnectRelevantCard;
