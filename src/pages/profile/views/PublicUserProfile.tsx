import Tabs from "./components/Tabs";
import { useState } from "react";
import About from "./components/About";
import Posts from "./components/Posts";
import PublicProfileHeader from "./components/PublicProfileHeader";
import PublicProfileDetails from "./components/PublicProfileDetails";
const PublicUserProfile = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  return (
    <div>
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
  );
};

export default PublicUserProfile;
