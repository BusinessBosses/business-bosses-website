import { LuSettings } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";

const MyProfileHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 w-full z-50"  style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)'}}>
      <div className="flex items-center p-5 justify-between bg-white px-3 py-2">
        <p className="text-lg font-semibold text-[#333333]">My Profile</p>
        <button onClick={() => navigate(RoutesPath.settings)}>
          <LuSettings size={40} style={{padding:5}} strokeWidth={1.8} color="#232324"  />
        </button>
      </div>
    </div>
  );
};

export default MyProfileHeader;
