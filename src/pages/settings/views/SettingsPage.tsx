import React, { ReactNode, useRef, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import Popup from "reactjs-popup";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import FilledButtonsmall from "../../../common/components/buttons/FilledButtonsmall";
import { toast } from "react-toastify";
import { StorageEnum } from "../../../common/emums/StorageEmuns";
import AuthController from "../../authentication/controller/AuthController";

const SettingsPage = () => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleSignOutClick = () => {
    setShowConfirmation(true);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const login = async () => {
    if (loading) return;
    const validate = AuthController.validateLogin({
      email:`${process.env.REACT_APP_DUMMY_EMAIL}`,
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
        navigate(RoutesPath.home);
      }else{
        toast.error("Oops, try again! An Error Occurred");

      }

      setLoading(false);
    }
  };
  const handleConfirmSignOut= () => {
    login();

   
    setShowConfirmation(false);
  };

  const handleCancelSignout= () => {
    setShowConfirmation(false);
  };



  return (
    <div>
      {showConfirmation && (
          <div className="confirmation-overlay">

          <div className="confirmation-dialog rounded-xl mx-5 bg-white">
            <div className="font-bold text-lg text-center pt-10">Do you want to Sign Out?</div>
            <div className="text-center text-sm lg:text-base pt-2 pl-10 pr-10">You will be signed out of your account and you will no longer be able to use Business Bosses extra features.</div>
            <div className="flex justify-center pt-5 pb-10">
              <button onClick={handleCancelSignout} style={{ color: 'grey', fontWeight: 'bold' }}>Cancel</button>
              <div className="ml-5">
                <FilledButtonsmall onClick={handleConfirmSignOut} text={"Sign Out"} /></div>
            </div>
            </div>
          </div>
        )}
      <div className=" top-0 w-full z-50 mobile-only " style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

        <CommonPageHeader title="Settings" />
      </div>


      <div className="px-5 mobile-only">
        <Tab onClick={() => { navigate(RoutesPath.communityrules); }} text="Community Rules" />
        <Tab onClick={() => { navigate(RoutesPath.invitetandcs); }} text="Invite a friends terms & conditions" />
        <Tab onClick={() => { }} text="Contact Us" />
        <Tab onClick={() => { }} text="Change Password" />
        <Tab onClick={() => { }} text="Delete Account" />
        <div className="my-10"></div>
        <Tab
          onClick={() => {
            localStorage.clear();
            handleSignOutClick();
          }}
          text="Sign Out"
        />
        
        <div className="my-10 flex items-center justify-center">
          <img src={Assets.Logo} className="h-16 w-16" alt="" />
        </div>

      </div>

      <div className="bg-[#ffffff] min-h-screen h-full computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5 pl-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile.profile!} />
              </div>
            </div>





          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >

            <CommonPageHeader title="Settings" />


            <div className="px-5">
              <Tab onClick={() => { navigate(RoutesPath.communityrules); }} text="Community Rules" />
              <Tab onClick={() => { navigate(RoutesPath.invitetandcs); }} text="Invite a friends terms & conditions" />
              <Tab onClick={() => { }} text="Contact Us" />
              <Tab onClick={() => { }} text="Change Password" />
              <Tab onClick={() => { }} text="Delete Account" />
              <div className="my-10"></div>
              <Tab
                onClick={() => {
                  localStorage.clear();
                  handleSignOutClick();
                  
                }}
                text="Sign Out"
              />
              <div className="my-10 flex items-center justify-center">
                <img src={Assets.Logo} className="h-16 w-16" alt="" />
              </div>

            </div>

          </div>

          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
                        className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
                        style={{
                            width: "30%",
                            flexGrow: 0,
                            overflow: "none",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                        <div className="rounded-xl overflow-hidden" style={{}}>
                            {profile.bossup ? (
                                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
                            ) : null}
                        </div>
                    </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

interface Props {
  onClick: VoidFunction;
  text: string;
}
const Tab = ({ onClick, text }: Props) => {
  return (
    <div>
      <div className="mobile-only">
        <button
          onClick={onClick}
          className="bg-white flex p-4 rounded-lg mb-4 items-center justify-between w-full "
        >
          <p className="text-sm font-bold">{text}</p>
          <Assets.Nexticon className="text-[#726F6F]" />
        </button>
      </div>

      <div className="computer-only">
        <button
          onClick={onClick}
          className="bg-[#f4f4f4] flex p-4 rounded-lg my-3 items-center justify-between w-full "
        >
          <p className="text-base">{text}</p>
          <Assets.Nexticon className="text-[#726F6F]" />
        </button>
      </div>
    </div>
  );
};
