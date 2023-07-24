import MobileBossOfTheWeek from "./components/MobileBossOfTheWeek";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileHeader from "./components/MobileHeader";
import PostItem from "./components/PostItem";
import ComputerHeader from "./components/ComputerHeader";
import ComputerBossOfTheWeek from "./components/ComputerBossOfTheWeek";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import MyProfileHeader from "../../profile/views/components/MyProfileHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import RoutesPath from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { IoIosMore } from "react-icons/io";
import { ReactNode } from "react";
import Popup from "reactjs-popup";


const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mobile-only">
        <MobileHeader />
        <div className="" style={{ paddingTop: 45 }}>
          <MobileBossOfTheWeek />
        </div>
        <div className="p-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
            <PostItem key={post} />
          ))}

        </div>
        <div className="my-20"></div>
        <MobileBottomNav currentIndex={0} />
      </div>


      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection ml-5 lg:ml-40 mr-5 pl-0" style={{
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
          <div className="computer-main-content" style={{ paddingTop: 80, width: '40%', flexGrow: 0 }} >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
              <PostItem key={post} />
            ))}
          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-5 lg:mr-40 pr-0 mb-0" style={{
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

export default HomePage;
