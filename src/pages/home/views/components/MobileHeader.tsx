import { CiSearch } from "react-icons/ci";
import Assets from "../../../../assets";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { useAppSelector } from "../../../../redux/store/store";
import { useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup";
import NotsignedinPopUp from "../../../../common/components/popups/notsignedinpopup";
interface Props {
  unseenChat?: boolean;
  unseenNotification?: boolean;
  coins?: number;
}
const MobileHeader = ({ unseenChat, unseenNotification, coins }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);
  const [showDiv, setShowDiv] = useState(false);
  const divRef = useRef(null);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / windowHeight) * 100;

      // Adjust the threshold (20 in this case) as needed
      if (scrollPercentage >= 20) {
        setShowDiv(true);
      } else {
        setShowDiv(false);
      }
    };
    
   

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function shownotsignedinPopup(): void {
    throw new Error("Function not implemented.");
  }

  const handleButtonClick = () => {
    const confirmMessage = 'You need to sign in or create an account to be able to use this feature';
    if (window.confirm(confirmMessage)) {
      navigate(RoutesPath.login)
    } else {

    }
  };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="bg-white top-0 w-full z-50" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.02)', }}>

        <div className="flex items-center justify-between px-3 py-2">
          <button
            onClick={profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick :() => navigate(RoutesPath.chats)}
            className="bg-white shadow p-2 rounded-lg relative flex items-center justify-center" style={{ width: 40, height: 40 }}
          >
            <img src={Assets.MessageIcon} alt="" className="p-0.5" />

            {unseenChat ? (
              <div className="absolute h-2 w-2 bg-primary rounded-full top-0 right-0" />
            ) : null}
          </button>
          <button
            onClick={profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick :() => navigate(RoutesPath.homeSearch)}
            className="flex items-center flex-grow bg-[#F4F4F4] py-2 px-2 mx-3 rounded-lg" style={{ height: 40 }}
          >
            <CiSearch className="text-[#A9A9A9]" size={20} />

            <p className="text-[#A9A9A9] text-sm pl-2 line-clamp-1">Search people & posts</p>
          </button>
          <div onClick={profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            handleButtonClick :() => { navigate(RoutesPath.invite) }} className="flex items-center px-2 mr-3 justify-center py-1 bg-[#F4F4F4] rounded-full">
            <div className="mr-1"><img src={Assets.Coin} alt="" /></div>
            <p className="font-semibold text-sm">
              <span style={{ color: '#333333' }}>{coins}</span>
            </p>

          </div>
          <button
             onClick={profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
             handleButtonClick :() =>
             navigate(RoutesPath.login)
              
            }
            className="bg-white shadow p-2 rounded-lg relative flex items-center justify-center" style={{ width: 40, height: 40 }}
          >
            <img src={Assets.NotificationIcon} alt="" />

            {unseenNotification ? (
              <div className="absolute h-2 w-2 bg-primary rounded-full top-0 right-0" />
            ) : null}
          </button>

        </div>

      </div>
      <div className="bg-transparent">
        {profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` && showDiv ? <div className="justify-center items-center flex ">
          <div style={{ position: 'absolute' }}>
            <div className="p-4 flex justify-between items-center mt-12" style={{ position: 'relative', zIndex: 2 }}>
              <div className="flex" style={{ height: '100%' }}>
                <button
                  onClick={() => navigate(RoutesPath.register)}
                  className={`bg-white shadow-xl rounded-full text-primary text-xs shadow-lg flex items-center justify-center font-bold p-2 px-4 relative`}
                  style={{ height: '100%', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
                >
                  Log In
                  <span
                    className="ml-2" // Add margin-left for spacing between text and arrow
                  >
                    &rarr;
                  </span>
                </button>
              </div>

            </div>

          </div>

        </div> : null}
      </div>
    </div>
  );
};

export default MobileHeader;
