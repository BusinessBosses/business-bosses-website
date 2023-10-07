import Assets from "../../../../assets";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import { useAppSelector } from "../../../../redux/store/store";
import SubscribeButton from "../../../settings/components/Subscribebutton";
import ConnectRelevant from "../../../settings/views/ConnectRelevant";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import { ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { StorageEnum } from "../../../../common/emums/StorageEmuns";
import AuthController from "../../../authentication/controller/AuthController";

interface Props {
  data: User;
}

const ComputerProfileDetails = ({ data }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);

  // Function to handle the click event
  const handleProfileClick = () => {
    // Example: Navigate to a specific route when the profile is clicked
    navigate(RoutesPath.myProfile, { state: { userId: data.uid } });
  };
  const [loading, setLoading] = useState<boolean>(false);
  const login = async () => {
    if (loading) return;
    const validate = AuthController.validateLogin({
      email: `${process.env.REACT_APP_DUMMY_EMAIL}`,
      password: `${process.env.REACT_APP_DUMMY_PASSWORD}`,
      terms: true,
    });
    if (validate) {
      setLoading(true);
      const response = await AuthController.loginRequest({
        email: `${process.env.REACT_APP_DUMMY_EMAIL}`,
        password: `${process.env.REACT_APP_DUMMY_PASSWORD}`,
      });
      if (response.success) {
        localStorage.setItem(
          StorageEnum.AccessToken,
          response.data.accessToken
        );
        localStorage.setItem(StorageEnum.UserId, response.data.uid);
        toast.success("You have been signed out");
        
        // Reload the page to navigate to the home
        window.location.reload();
      } else {
        toast.error("Oops, try again! An Error Occurred");
      }
      
      setLoading(false);
    }
  };
  

  return (
    <div className=" " style={{ cursor: "pointer", height: "100vh", width: "100vh" }}>
     
      <div className="mt-5 ">
        <div className="flex items-top jusity-between gap-3">
          <div className="flex flex-grow" onClick={handleProfileClick}>
            <UserAvatar imageSize="h-24 w-24" imageURL={data.photoUrl} />
            <div className="ml-5">
              <p className="text-xl font-semibold">{data.name}</p>
              <p className="text-lg font-medium">{data.category}</p>
              <p className="font-medium">{data.companyName}</p>
              <p className="text-sm font-light text-[#A9A9A9]">
                {data.location}
              </p>
              <div className="flex items-center mt-1">
                <div className="bg-[#F4F4F4] rounded-full mr-3 flex items-center py-1 px-2">
                  <img src={Assets.Coin} alt="" className="w-4 h-4" />
                  <small className="ml-2">{data.coinscount}</small>
                </div>
              </div>
            </div>
          </div>

          <Popup
                trigger={
                  <div>
                    <IoIosMore size={20} />
                  </div>
                }
                position="left top"
                on="click"
                closeOnDocumentClick
                contentStyle={{ padding: "0px", border: "none" }}
              // overlayStyle={{
              //   background: "rgba(0, 0, 0, 0.8)",
              //   zIndex: 1000,
              // }}
              >
                {
                  (((close: any) =>
                    
                      <div className=" bg-white shadow-xl rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                        <button
                          onClick={() => {
                            navigate(RoutesPath.myProfile)
                            close();
                            
                          }}
                          className="menu-item border-none outline-none"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate(RoutesPath.settings)
                            close();
                          
                            
                          }}
                          className="menu-item border-none outline-none"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            login();
                            close();
                          
                            
                          }}
                          className="menu-item border-none outline-none"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) as unknown) as ReactNode
                }
              </Popup>
            
        </div>
        <div className="mt-2">
          <SubscribeButton />
        </div>

        <div>
          <div className="flex items-center mt-5 pb-2">
            <div className="font-bold">Connect Relevant People</div>
          </div>
          <div className="pb-2"></div>
          <ConnectRelevant />
        </div>
      </div>
    </div>
  );
};

export default ComputerProfileDetails;
