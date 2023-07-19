import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { AiOutlineMore } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
interface Props {
  name: string;
}
const PublicProfileHeader = ({ name }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 w-full z-50">
      <div className="flex items-center p-5 justify-between bg-white">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)}>
            <BiArrowBack size={20} />
          </button>
          <p className="text-lg font-semibold text-[#333333]">@{name}</p>
        </div>
        <button onClick={() => navigate(RoutesPath.settings)}>
          <AiOutlineMore color="#232324" size={20} />
        </button>
      </div>
    </div>
  );
};

export default PublicProfileHeader;
