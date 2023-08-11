import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { AiOutlineMore, AiOutlineSetting } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import Assets from "../../../../assets";
import { IoIosMore } from "react-icons/io";
interface Props {
  name: string;
}
const PublicProfileHeader = ({ name }: Props) => {
  const navigate = useNavigate();
  return (
    <div>

      <div className="mobile-only mb-5" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff',}}>
        <div className="flex items-center p-5 px-3 py-2 justify-between bg-white">
          <div className="flex items-center gap-5">
            <button onClick={() => navigate(-1)}>
              <Assets.Backbutton />
            </button>
            <p className="text-lg font-semibold text-[#333333]">@{name}</p>
          </div>
          <button onClick={() => navigate(RoutesPath.settings)}>
          <IoIosMore size={23} />
          </button>
        </div>
      </div>

      <div className="computer-only top-0 w-full z-50">
        <div className="flex items-center p-5 justify-between bg-white">
          <div className="flex items-center gap-5">
            <button onClick={() => navigate(-1)}>
              <Assets.Backbutton />
            </button>
            <p className="text-2xl font-semibold text-[#333333]">@{name}</p>
          </div>
          <button onClick={() => navigate(RoutesPath.settings)}>
            <AiOutlineMore color="#232324" size={20} />
          </button>
        </div>
      </div>


    </div>
  );
};

export default PublicProfileHeader;
