import Assets from "../../../../assets";
import { Market } from "../../../../common/interfaces/Market";
import { useAppSelector } from "../../../../redux/store/store";
import MarketController from "../../controller/MarketController";


interface Props {
  currentIndex: number;
  onChangeRoute: Function;
  uid: any;
}
const MarketplaceTab = ({ currentIndex, onChangeRoute, uid }: Props) => {
  const market = useAppSelector((state) => state.market);
  const profile = useAppSelector((state) => state.user.profile);

  return (<div className="sticky">
    <div className="mobile-only" style={{ height: "1px", width: "100%", background: "#f4f4f4" }}></div>
    <div className=" top-12 bg-[#f9f9f9] z-50">


      <div className="grid grid-cols-3 items-center justify-between" >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => onChangeRoute(0)} className="">
          {currentIndex === 0 ? <img src={Assets.dashboardicon} style={{ width: 20, height: 40, color: "#333333", paddingBottom:"10px"}} className="w-full flex-grow border-b-2 border-b-primary pt-3 " />
           : <img src={Assets.dashboardicon} style={{ width: 20, height: 40, color: "#A9A9A9", paddingBottom:"10px" }} className="w-full flex-grow pt-3" />}
        </div>

        <button
          onClick={() => onChangeRoute(1)}
          className={`${currentIndex === 1
            ? "text-[#333333] w-full flex-grow border-b-2 border-b-primary pb-3 pt-3 text-xs font-bold lg:text-base"
            : "text-[#A9A9A9] pb-3 pt-3 text-xs lg:text-base"
            }`}
        >
          Products
        </button>

        {<button
          onClick={() => onChangeRoute(2)}
          className={`${currentIndex === 2
            ? "text-[#333333] w-full flex-grow border-b-2 border-b-primary pb-3 pt-3 text-xs font-bold lg:text-base"
            : "text-[#A9A9A9] pb-3 pt-3 text-xs lg:text-base"
            }`}
        >
          Services
        </button>}
      </div>


      <div className="mobile-only" style={{ height: "1px", width: "100%", background: "#f4f4f4" }}></div>
    </div >
  </div>
  );
};

export default MarketplaceTab;
