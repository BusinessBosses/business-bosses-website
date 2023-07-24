import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import MyProfileHeader from "./components/MyProfileHeader";
import MyProfileDetails from "./components/MyProfileDetails";
import Tabs from "./components/Tabs";
import { ReactNode, useState } from "react";
import About from "./components/About";
import Posts from "./components/Posts";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
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
        <div className="mt-20"></div>
        <MobileBottomNav currentIndex={3} />
      </div>

      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
        <div className="firstsection ml-0 mr-5 pl-5 lg:ml-20" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: '100%'
          }}>
            <div className="" >


              <div className="flex items-center " >

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
          <div className="lastsection ml-5 mr-5 mb-40 lg:mr-20" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}>
            <div className="" >
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

export default MyProfile;
