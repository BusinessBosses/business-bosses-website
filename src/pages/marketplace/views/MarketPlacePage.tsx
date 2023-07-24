import { CiSearch } from "react-icons/ci";
import MobileMarketIntro from "./components/MobileMarketIntro";
import MarketItem from "./components/MarketItem";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { ReactNode } from "react";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import RoutesPath from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiBorderRight } from "react-icons/bi";

const MarketPlacePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mobile-only">
        <div className="fixed top-0 w-full z-50" style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}>
          <div className="flex items-center justify-between bg-white px-3 py-2">
            <p className="text-lg font-semibold text-[#333333]">Marketplace</p>
            <CiSearch size={40} style={{ padding: 7 }} strokeWidth={0.5} />
          </div>
        </div>

        <div style={{ height: '30%', overflow: 'hidden' ,paddingTop:45}}>
          <MobileMarketIntro />
        </div>

        <div style={{ height: '40%', overflow: 'hidden' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((market) => (
            <MarketItem key={market} />
          ))}
        </div>

        <MobileBottomNav currentIndex={2} />
      </div>

      <div className="computer-only flex">
        <ComputerHeader />
        <div className="computer-content flex" style={{ height: '100%', width: '100%' }}>
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
          
          <div className="computer-main-content mt-5" style={{ width: '40%', flexGrow: 0, borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)', boxSizing: 'border-box', borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((market) => (
              <MarketItem key={market} />
            ))}
          </div>

          <div
            className="lastsection ml-5 mr-5 lg:mr-40 "
            style={{
              width: '30%',
              flexGrow: 0,
              overflow: 'scroll', 
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="w-30" style={{ position: "sticky" }}>
              <MobileMarketIntro />
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

export default MarketPlacePage;
