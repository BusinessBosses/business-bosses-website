import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Notification from "./components/Notification";
import DailyQuotes from "./components/DailyQuotes";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import PostItem from "../../home/views/components/PostItem";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { ReactNode } from "react";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import RoutesPath from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mobile-only">
        <div className="fixed top-0 w-full z-50">
          <CommonPageHeader title="Notifications" />
        </div>
        <div className="my-16"></div>
        <DailyQuotes />

        <div className="p-5">
          <h3 className="text-xl font-medium">Activity</h3>
          <Notification />
          <Notification />
          <Notification />
        </div>
      </div>


      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
        <div className="firstsection ml-40 mr-5" style={{
            width: '30%',

            flexGrow: 0,
            overflow: 'scroll',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: '100%'

          }} >
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
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" style={{width:'40%',  flexGrow: 0}}>
            <div className="" style={{paddingLeft:20, paddingRight:20, paddingTop:50,}}>
              <h3 className="text-xl font-medium">Activity</h3>
              <Notification />
              <Notification />
              <Notification />
              <Notification />
              <Notification />
              <Notification />
              <Notification />
              <Notification />
              <Notification />
            </div>
          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-40 mb-40" style={{width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: '100%'}}>
            <div className="" >
            < DailyQuotes />
            </div>
          

          </div>

        </div>
      </div>
    </div>



  );
};

export default NotificationPage;
