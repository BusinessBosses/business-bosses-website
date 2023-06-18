import { LuSettings } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";

const MyProfileHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 w-full z-50">
      <div className="flex items-center p-5 justify-between bg-white">
        <p className="text-lg font-semibold text-[#333333]">My Profile</p>
        <button onClick={() => navigate(RoutesPath.settings)}>
          <LuSettings color="#232324" size={20} />
        </button>
      </div>
    </div>
  );
};

export default MyProfileHeader;
