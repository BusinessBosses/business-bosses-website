import React, { useState, useEffect, ReactNode } from "react";
import { CiSearch } from "react-icons/ci";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Challenge from "./Challenge";
import Tabs from "./components/Tabs";
import RoutesPath from "../../../constants/Routes";
import Learning from "./Learning";
import Opportunities from "./Opportunities";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ForumCard from "../../../common/components/forum/ForumCard";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import Popup from "reactjs-popup";
import ForumItem from "../../../common/components/forum/ForumItem";
import ComputerTopNav from "../../home/views/components/ComputerTopNav";

const BossupPage = () => {
  const tabs: string[] = ["", RoutesPath.learning, RoutesPath.opportunities];
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentRoute, setCurrentRoute] = useState<string>("");

  const changeRoute = (index: number) => {
    setCurrentIndex(index);
    const tab: string = tabs[index].split("/").pop() ?? "";
    setCurrentRoute(tab);
    navigate(tab);
  };

  const initRoute = () => {
    const findCurrentRouteIndex = tabs.findIndex(
      (fd) => fd === location.pathname.split("/bossup").pop()?.toLowerCase()
    );
    if (findCurrentRouteIndex !== -1) {
      setCurrentIndex(findCurrentRouteIndex);
      setCurrentRoute(tabs[findCurrentRouteIndex].split("/").pop() ?? "");
    } else {
      setCurrentIndex(0);
      setCurrentRoute(tabs[0].split("/").pop() ?? "");
    }
  };

  useEffect(() => {
    initRoute();
  }, []);

  // Function to render the content in the lastsection div
  const renderLastSectionContent = () => {
    if (currentIndex === 1) {
      return (
        <div>
          <div className="pb-5">
            <ForumCard
              banner="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
              didJoin={false}
              label="Ideas on how to create things easily"
              members={20}
              onJoin={() => { }}
              topics={20}
            />
          </div>
          <Learning />
        </div>
      );
    } else if (currentIndex === 2) {
      return (
        <div>
          <div className="pb-5">
            <ForumCard
              banner="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
              didJoin={false}
              label="Ideas on how to create things easily"
              members={20}
              onJoin={() => { }}
              topics={20}
            />
          </div>
          <Opportunities />
        </div>
      );
    } else {
      // Default content for other tabs (assuming Challenge tab is displayed by default)
      return (
        <div className=" ">
          <ForumCard
            banner="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
            didJoin={false}
            label="Ideas on how to create things easily"
            members={20}
            onJoin={() => { }}
            topics={20}
          />
          <div className="bg-[#F4F4F4] flex items-center justify-between p-2 rounded-lg mt-2">
            <small className="text-xs text-[#545151]">Boss Up by</small>
            <p className="text-[#545151] text-sm">
              Business Bosses Company Limited
            </p>
            <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="mobile-only">
        <div className="fixed top-0 left-0 w-screen h-screen">
          <div className="relative fixed top-0 left-0 w-full  bg-white shadow-lg ">
            <div className="flex items-center p-5 justify-between bg-white">
              <p className="text-lg font-semibold text-[#333333]">Boss Up</p>
              <CiSearch size={40} style={{ padding: 7 }} strokeWidth={0.5} />
            </div>

            <div className="">
              <Tabs
                onChangeRoute={(index: number) => changeRoute(index)}
                currentIndex={currentIndex}
              />
            </div>
          </div>
        </div>


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

          <div style={{ visibility: "hidden", height: "", width: '0%', background: 'transparent' }}>
            <ComputerTopNav
              currentIndex={currentIndex}
              onTabClick={changeRoute}
              currentRoute={currentRoute}
            />
          </div>
          <div className="firstsection ml-5 mr-5 pl-0 lg:ml-40 " style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}>
            <div className="" >


              <div className="flex items-center " onClick={() => navigate(RoutesPath.myProfile)}>

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
                // arrow={false}
                >
                  {
                    (((close: any) => (
                      <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                        <button
                          onClick={() => {
                            close();
                          }}
                          className="menu-item"
                        >
                          Hide
                        </button>
                        <button
                          onClick={() => {
                            close();
                          }}
                          className="menu-item"
                        >
                          Report
                        </button>
                      </div>
                    )) as unknown) as ReactNode
                  }
                </Popup>


              </div>
            </div>



          </div>
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" style={{ width: '40%', position: 'sticky', top: '0' }}>
            <div>
              <div className="sticky top-100 mt-5">
                <Tabs
                  onChangeRoute={(index: number) => changeRoute(index)}
                  currentIndex={currentIndex}
                />
              </div>
            </div>

            <Routes>
              <Route index element={<Challenge />} />
              <Route path={RoutesPath.learning} element={<div>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
                  <ForumItem key={post} />
                ))}
              </div>} />
              <Route path={RoutesPath.opportunities} element={<div>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
                  <ForumItem key={post} />
                ))}
              </div>} />
            </Routes>
            <div className="my-20"></div>
          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-5 mb-40 lg:mr-40 pr-0" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}>
            {renderLastSectionContent()}

          </div>
        </div>
      </div>



    </div>
  );
};

export default BossupPage;





