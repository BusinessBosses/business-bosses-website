import { CiSearch } from "react-icons/ci";
import MobileMarketIntro from "./components/MobileMarketIntro";
import MarketItem from "./components/MarketItem";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
const MarketPlacePage = () => {
  return (
    <div>
      <div className="mobile-only">
        <div className="fixed top-0 w-full z-50">
          <div className="flex items-center p-5 justify-between bg-white">
            <p className="text-lg">Marketplace</p>
            <CiSearch size={20} />
          </div>
        </div>

        <div className="mt-20">
          <MobileMarketIntro />
        </div>

        <div className="p-5">
          {[1, 2, 3, 4, 5, 6, 7].map((market) => (
            <MarketItem key={market} />
          ))}
        </div>
        <div className="my-20"></div>
        <MobileBottomNav currentIndex={2} />

      </div>


      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection">
            <div className="fixed flex items-center">
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
          <div className="computer-main-content" style={{paddingLeft:20,paddingRight:20}} >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((market) => (
              <MarketItem key={market} />
            ))}
          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection" style={{}}>


          </div>

        </div>
      </div>
    </div>




  );
};

export default MarketPlacePage;
