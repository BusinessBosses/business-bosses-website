import { CiSearch } from "react-icons/ci";
import Assets from "../../../../assets";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
interface Props {
  unseenChat?: boolean;
  unseenNotification?: boolean;
  coins?: number;
}
const MobileHeader = ({ unseenChat, unseenNotification, coins }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white top-0 w-full z-50" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.02)' }}>
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={() => navigate(RoutesPath.chats)}
          className="bg-white shadow p-2 rounded-lg relative flex items-center justify-center" style={{ width: 40, height: 40 }}
        >
          <img src={Assets.MessageIcon} alt="" className="p-0.5" />

          {unseenChat ? (
            <div className="absolute h-2 w-2 bg-primary rounded-full top-0 right-0" />
          ) : null}
        </button>
        <button
          onClick={() => navigate(RoutesPath.homeSearch)}
          className="flex items-center flex-grow bg-[#F4F4F4] py-2 px-2 mx-3 rounded-lg" style={{ height: 40 }}
        >
          <CiSearch className="text-[#A9A9A9]" size={20} />
          <p className="text-[#A9A9A9] text-xs pl-2line-clamp-1">
            Search people & posts
          </p>
        </button>
        <div onClick={()=>{navigate(RoutesPath.invite)}} className="flex items-center px-2 mr-3 justify-center py-1 bg-[#F4F4F4] rounded-full">
          <div className="mr-1"><img src={Assets.Coin} alt="" /></div>
          <p className="font-medium">
            <span style={{ color: '#333333' }}>{coins}</span>
          </p>

        </div>
        <button
          onClick={() => navigate(RoutesPath.notifications)}
          className="bg-white shadow p-2 rounded-lg relative flex items-center justify-center" style={{ width: 40, height: 40 }}
        >
          <img src={Assets.NotificationIcon} alt="" />

          {unseenNotification ? (
            <div className="absolute h-2 w-2 bg-primary rounded-full top-0 right-0" />
          ) : null}
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
