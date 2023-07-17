import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import MyProfileHeader from "./components/MyProfileHeader";
import MyProfileDetails from "./components/MyProfileDetails";
import Tabs from "./components/Tabs";
import { useState } from "react";
import About from "./components/About";
import Posts from "./components/Posts";
import ComputerHeader from "../../home/views/components/ComputerHeader";
const MyProfile = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  return (
    <div>
      <div className="mobile-only">
        <MyProfileHeader />
        <MyProfileDetails />

        <div className="mt-3">
          <Tabs
            currentIndex={currentTabIndex}
            onChangeRoute={(index: number) => setCurrentTabIndex(index)}
          />

          {currentTabIndex === 0 ? <About /> : null}
          {currentTabIndex === 1 ? <Posts /> : null}
        </div>
        <div className="my-20"></div>
        <MobileBottomNav currentIndex={3} />
      </div>

      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection">




          </div>
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" style={{ paddingTop: 50}} >

            <MyProfileDetails />
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
            <div className="fixed" style={{ paddingRight: 150 }}>


            </div>


          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;
