import React, { ReactNode } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import Popup from "reactjs-popup";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";

const SettingsPage = () => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);
  return (
    <div>
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
            navigate(RoutesPath.login);
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
                  navigate(RoutesPath.login);
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
