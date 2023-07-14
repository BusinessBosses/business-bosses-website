import MobileBossOfTheWeek from "./components/MobileBossOfTheWeek";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileHeader from "./components/MobileHeader";
import PostItem from "./components/PostItem";
import ComputerHeader from "./components/ComputerHeader";
import ComputerBossOfTheWeek from "./components/ComputerBossOfTheWeek";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import MyProfileHeader from "../../profile/views/components/MyProfileHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";


const HomePage = () => {
  return (
    <div>
      <div className="mobile-only">
        <MobileHeader />
        <div className="mt-20">
          <MobileBossOfTheWeek />
        </div>
        <div className="p-5">
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
          <div className="computer-main-content" style={{paddingTop:50,paddingLeft:20,paddingRight:20}} >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
              <PostItem key={post} />
            ))}
          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection">
            <div className="fixed" style={{paddingRight:150}}>
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
