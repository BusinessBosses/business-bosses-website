import { LuSettings } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { useAppSelector } from "../../../../redux/store/store";

const MyProfileHeader = () => {
  const profile = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="bg-white top-0 w-full z-50" style={{ position: 'sticky', top: 0, zIndex: 100,}}>
      <div className="flex items-center p-5 justify-between bg-white px-3 py-2">
        <p className="text-lg font-semibold lg:text-xl text-[#333333]">@{profile.profile?.username}</p>
        <button onClick={() => navigate(RoutesPath.settings)}>
          <LuSettings size={35} style={{padding:5}} strokeWidth={1.8} color="#232324"  />
        </button>
      </div>
    </div>
  );
};

export default MyProfileHeader;
