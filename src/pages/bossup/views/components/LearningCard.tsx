import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import RoutesPath from "../../../../constants/Routes";
import { useNavigate } from "react-router-dom";

const LearningCard = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(RoutesPath.forum)}
      className="bg-white shadow p-2 rounded-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#333333] text-sm ">Affiliate Marketing</p>
        <MdOutlineKeyboardArrowRight className="text-primary" />
      </div>
      <img
        src="https://cdn.pixabay.com/photo/2023/05/05/11/07/sweet-7972193_640.jpg"
        className="h-20 w-full rounded-lg object-cover"
        alt=""
      />
    </div>
  );
};

export default LearningCard;
