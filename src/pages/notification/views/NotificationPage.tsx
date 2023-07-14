import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Notification from "./components/Notification";
import DailyQuotes from "./components/DailyQuotes";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import PostItem from "../../home/views/components/PostItem";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const NotificationPage = () => {
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
          <div className="firstsection">
            <div className="flex items-center fixed">
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
          <div className="computer-main-content" >
            <div className="" style={{paddingLeft:20, paddingRight:20, paddingTop:50}}>
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
          <div className="lastsection " >
            <div className="fixed" style={{paddingRight:150}}>
            < DailyQuotes />
            </div>
          

          </div>

        </div>
      </div>
    </div>



  );
};

export default NotificationPage;
