import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import MyProfileHeader from "./components/MyProfileHeader";
import MyProfileDetails from "./components/MyProfileDetails";
import Tabs from "./components/Tabs";
import { useState } from "react";
import About from "./components/About";
import Posts from "./components/Posts";
const MyProfile = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  return (
    <div>
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
  );
};

export default MyProfile;
