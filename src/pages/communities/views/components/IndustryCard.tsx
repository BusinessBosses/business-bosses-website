import RoutesPath from "../../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { Industry } from "../../../../common/interfaces/industry";
import Assets from "../../../../assets";
interface Props {
  industry: Industry;
}
const IndustryCard = ({ industry }: Props) => {
  const navigate = useNavigate();
  return (
    <div>
    <div
      className="bg-white shadow p-2 rounded-xl mobile-only"
      onClick={() => navigate(RoutesPath.forum, { state: industry })}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#333333] text-sm font-[700]">{industry.industry}</p>
        <Assets.Nexticon className="text-primary" stroke="#F21C29"/>
      </div>
      <img
        src={industry.photo}
        className="h-25 w-full rounded-lg object-cover"
        alt=""
      />
    </div>

    <div
      className="bg-white shadow p-2 rounded-xl computer-only"
      onClick={() => navigate(RoutesPath.forum, { state: industry })}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#333333] text-base font-[700] ">{industry.industry}</p>
        <Assets.Nexticon  stroke="#F21C29" className="text-primary" />
      </div>
      <img
        src={industry.photo}
        className="h-30 w-full rounded-lg object-cover"
        alt=""
      />
    </div>
    </div>
  );
};

export default IndustryCard;
