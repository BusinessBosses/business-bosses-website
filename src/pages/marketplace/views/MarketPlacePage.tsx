import { CiSearch } from "react-icons/ci";
import MobileMarketIntro from "./components/MobileMarketIntro";
import MarketItem from "./components/MarketItem";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
const MarketPlacePage = () => {
  return (
    <div>
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
  );
};

export default MarketPlacePage;
