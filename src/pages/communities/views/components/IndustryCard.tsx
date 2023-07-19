import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import RoutesPath from "../../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { Industry } from "../../../../common/interfaces/industry";
interface Props {
  industry: Industry;
}
const IndustryCard = ({ industry }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(RoutesPath.forum, { state: industry })}
      className="bg-white shadow p-2 rounded-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#333333] text-sm ">{industry.industry}</p>
        <MdOutlineKeyboardArrowRight className="text-primary" />
      </div>
      <img
        src={industry.photo}
        className="h-20 w-full rounded-lg object-cover"
        alt=""
      />
    </div>
  );
};

export default IndustryCard;
