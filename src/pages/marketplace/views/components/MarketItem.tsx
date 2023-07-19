import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import Assets from "../../../../assets";
import { MdLocationPin } from "react-icons/md";
import { AiTwotoneStar } from "react-icons/ai";

const MarketItem = () => {
  return (
    <div>
    <div className="my-5"style={{paddingLeft:20, paddingRight:20}}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar imageURL="https://cdn.pixabay.com/photo/2023/06/02/14/12/woman-8035772_640.jpg" />
          <div className="mobile-only">
            <p className="text-[#333333] text-sm" style={{fontWeight:'600'}}>Isaac Akin</p>
            <p className="text-xs text-[#777777]">Supplier of survey</p>
          </div>
          <div className="computer-only">
            <p className="text-[#333333] text-s" style={{fontWeight:'600'}}>Isaac Akin</p>
            <p className="text-sm text-[#777777]">Supplier of survey</p>
          </div>
        </div>
        <IoIosMore size={20} />
      </div>
      <div className="mt-2">
        <p className="text-[#4E4B4B] text-xs mb-2">Sponsored</p>
        <p className="text-[#232324] font-bold my-0">$3000.45</p>
        <p className="text-sm text-[#303133] mobile-only" style={{fontSize:13}}>
          For you to be effective at networking you should make it a hobby
        </p>
        <p className="text-sm text-[#303133] computer-only" style={{fontSize:14}}>
          For you to be effective at networking you should make it a hobby
        </p>
        <div className="my-0 flex items-center justify-between">
          <div className="flex text-[#878787] gap-1">
            <MdLocationPin />
            <small>Abuja</small>
          </div>
          <div className="flex text-[#878787] gap-1">
            <img src={Assets.Block} alt="" />
            <small>Fashion & Beauty</small>
          </div>
          <div className="flex  gap-1">
            <AiTwotoneStar className="text-[#FFCA28]" />
            <p className="text-sm font-bold text-[#383838]">3.4</p>
          </div>
          <small className="underline text-[#4E4B4B] ">Seller review</small>
        </div>
        <div className="mt-2">
          <img
            src="https://cdn.pixabay.com/photo/2018/10/05/14/39/sunset-3726030_640.jpg"
            alt=""
            className="rounded-lg w-full h-64 object-cover"
          />
          <div className="flex overflow-x-scroll mt-2 hide-scroll-bar">
            <div className="flex flex-nowrap gap-2">
              {[1, 2, 3, 4, 5].map((img) => (
                <div key={img} className="inline-block">
                  <div className="w-20 h-20 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <img
                      src="https://cdn.pixabay.com/photo/2016/10/18/21/22/beach-1751455_640.jpg"
                      alt=""
                      className="rounded-lg w-20 h-20 object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-5">
            <PostAction count="2" icon={Assets.Like} onClick={() => {}} />
            <PostAction count="5" icon={Assets.Comment} onClick={() => {}} />
            <PostAction count="2" icon={Assets.Coin} onClick={() => {}} />
            <PostAction count="2" icon={Assets.Share} onClick={() => {}} />
          </div>
          <small className="text-[#B4B4B4]">6 days ago</small>
        </div>
      </div>
    </div>
     <div className="mobile-only" style={{ height: "7px", width: "100%", background: "#f4f4f4" }}></div>
     <div className="computer-only" style={{ height: "1.2px", width: "100%", background: "rgba(0, 0, 0, 0.1)" }}></div>
     </div>
  );
};

export default MarketItem;

interface MarketActionProps {
  icon: any;
  count: string;
  active?: boolean;
  onClick: VoidFunction;
}
const PostAction = ({ count, icon, active, onClick }: MarketActionProps) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onClick}>
        <img src={icon} alt="" />
      </button>
      <p className="text-sm">{count}</p>
    </div>
  );
};
