import Tabs from "./components/Tabs";
import { useState } from "react";
import About from "./components/About";
import Posts from "./components/Posts";
import PublicProfileHeader from "./components/PublicProfileHeader";
import PublicProfileDetails from "./components/PublicProfileDetails";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import RoutesPath from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
const PublicUserProfile = () => {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  return (
    <div>
      <div className="mobile-only">
      <PublicProfileHeader />
      <PublicProfileDetails />

      <div className="mt-3">
        <Tabs
          currentIndex={currentTabIndex}
          onChangeRoute={(index: number) => setCurrentTabIndex(index)}
        />

        {currentTabIndex === 0 ? <About /> : null}
        {currentTabIndex === 1 ? <Posts /> : null}
      </div>
    </div>

    
    <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection">
            <div className="flex items-center fixed" onClick={() => navigate(RoutesPath.myProfile)}>
              
              <UserAvatar
                imageSize="h-24 w-24"
                imageURL="https://cdn.pixabay.com/photo/2023/06/12/07/15/spider-8057853__340.jpg"
              />
              <div className="ml-4">
                <p className="text-xl font-semibold">Isaac Akin</p>
                <p className="text-lg font-medium">Consultant</p>
                <p className="font-medium">Digital Blogger</p>
                <p className="text-sm font-light text-[#A9A9A9]">United Kingdom</p>
              </div>
              <div className="flex-grow" />
            </div>



          </div>
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" style={{paddingTop:50,paddingLeft:20,paddingRight:20}} >
          <PublicProfileDetails />

<div className="mt-3">
  <Tabs
    currentIndex={currentTabIndex}
    onChangeRoute={(index: number) => setCurrentTabIndex(index)}
  />

  {currentTabIndex === 0 ? <About /> : null}
  {currentTabIndex === 1 ? <Posts /> : null}
</div>
          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection">
            <div className="fixed" style={{paddingRight:150}}>
            <ComputerBossOfTheWeek />
            <div className="bg-[#F4F4F4] flex items-center justify-between p-2 rounded-lg mt-2">
              <small className="text-xs text-[#545151]">Boss Up by</small>
              <p className="text-[#545151] text-sm">
                Business Bosses Company Limited
              </p>
              <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />
            
            </div>

            </div>
          
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
