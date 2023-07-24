import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { AiOutlineMore, AiOutlineSetting } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";

const PublicProfileHeader = () => {
  const navigate = useNavigate();
  return (
    <div>

    <div className="fixed top-0 w-full z-50 mobile-only">
      <div className="flex items-center p-5 justify-between bg-white">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)}>
            <BiArrowBack size={20} />
          </button>
          <p className="text-lg font-semibold text-[#333333]">@Owen</p>
        </div>
        <button onClick={() => navigate(RoutesPath.settings)}>
          <AiOutlineMore color="#232324" size={20} />
        </button>
      </div>
    </div>

    <div className="computer-only mt-5 top-0 w-full z-50">
      <div className="flex items-center p-5 justify-between bg-white">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)}>
            <BiArrowBack size={20} />
          </button>
          <p className="text-2xl font-semibold text-[#333333]">@Owen</p>
        </div>
        <button onClick={() => navigate(RoutesPath.settings)}>
          <AiOutlineSetting color="#232324" size={30} />
        </button>
      </div>
    </div>


    </div>
  );
};

export default PublicProfileHeader;
