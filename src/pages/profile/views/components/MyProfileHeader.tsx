import { LuSettings } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";

const MyProfileHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white top-0 w-full z-50" style={{ position: 'sticky', top: 0, zIndex: 999, borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.02)' }}>
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
