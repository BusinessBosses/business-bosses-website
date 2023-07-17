import { CiSearch } from "react-icons/ci";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Challenge from "./Challenge";
import Tabs from "./components/Tabs";
import RoutesPath from "../../../constants/Routes";
import Learning from "./Learning";
import Opportunities from "./Opportunities";
import ComputerHeader from "../../home/views/components/ComputerHeader";

const BossupPage = () => {
  const tabs: string[] = ["", RoutesPath.learning, RoutesPath.opportunities];
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const changeRoute = (index: number) => {
    setCurrentIndex(index);
    const tab: string = tabs[index].split("/").pop() ?? "";
    navigate(tab);
  };

  const initRoute = () => {
    const findCurrentRouteIndex = tabs.findIndex(
      (fd) => fd === location.pathname.split("/bossup").pop()?.toLowerCase()
    );
    if (findCurrentRouteIndex !== -1) {
      setCurrentIndex(findCurrentRouteIndex);
    } else {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    initRoute();
  }, []);

  return (
    <div>
    <div className="mobile-only">
      <div className="fixed top-0 w-full z-50">
        <div className="flex items-center p-5 justify-between bg-white">
          <p className="text-lg">Boss Up</p>
          <CiSearch size={20} />
        </div>
      </div>
      <Tabs
        onChangeRoute={(index: number) => changeRoute(index)}
        currentIndex={currentIndex}
      />

      <Routes>
        <Route index element={<Challenge />} />
        <Route path={RoutesPath.learning} element={<Learning />} />
        <Route path={RoutesPath.opportunities} element={<Opportunities />} />
      </Routes>
      <div className="my-20"></div>
      <MobileBottomNav currentIndex={1} />
    </div>

    <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection" style={{  }}>
            

          </div>
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" >
            <div className="" style={{paddingTop:30, paddingLeft:20, paddingRight:20}}>
            <button
              onClick={() => navigate(RoutesPath.homeSearch)}
              className="flex items-center gap-2 bg-[#F4F4F4] py-4 px-12 rounded-lg"
              style={{width:'100%'}}
            >
              <CiSearch className="text-[#A9A9A9]" />
              <p className="text-[#A9A9A9] text-sm">Search people & posts</p>
            </button>
            </div>
         
          <Tabs
        onChangeRoute={(index: number) => changeRoute(index)}
        currentIndex={currentIndex}
      />
      <Routes>
        <Route index element={<Challenge />} />
        <Route path={RoutesPath.learning} element={<Learning />} />
        <Route path={RoutesPath.opportunities} element={<Opportunities />} />
      </Routes>
      <div className="my-20"></div>
            
          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection" style={{}}>
          <div className="flex items-center gap-2 ml-10">
            
          </div>
            
        
            
        

            
          </div>

        </div>
      </div>

    </div>
  );
};

export default BossupPage;
