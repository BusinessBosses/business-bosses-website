import { CiSearch } from "react-icons/ci";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Challenge from "./Challenge";
import Tabs from "./components/Tabs";
import RoutesPath from "../../../constants/Routes";
import Learning from "./Learning";
import Opportunities from "./Opportunities";

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
  );
};

export default BossupPage;
