import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import Assets from "../../../../assets";
import { MdLocationPin } from "react-icons/md";
import { AiTwotoneStar } from "react-icons/ai";
import { Market } from "../../../../common/interfaces/Market";
import trimText from "../../../../common/functions/trimText";
import formatDate from "../../../../common/functions/formatDate";
interface Props {
  data: Market;
}
const MarketItem = ({ data }: Props) => {
  return (
    <div className="my-10">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar
            imageURL={
              data.user?.photoUrl ??
              "https://cdn-icons-png.flaticon.com/128/149/149071.png"
            }
          />
          <div className="">
            <p className="text-[#333333] text-lg">{data.user?.username}</p>
            <p className="text-sm text-[#777777]">
              {trimText(data.user?.bio ?? "", 20)}
            </p>
          </div>
        </div>
        <IoIosMore size={20} />
      </div>
      <div className="mt-2">
        {data.promote ? (
          <p className="text-[#4E4B4B] text-xs mb-2">Sponsored</p>
        ) : null}
        <p className="text-[#232324] font-bold my-2">${data.price}</p>
        <p className="text-sm text-[#303133] break-words">{data.description}</p>
        <div className="my-2 flex items-center justify-between">
          {data.location ? (
            <div className="flex text-[#878787] gap-1">
              <MdLocationPin />
              <small>{data.location}</small>
            </div>
          ) : null}
          {data.category ? (
            <div className="flex text-[#878787] gap-1">
              <img src={Assets.Block} alt="" />
              <small>{data.category}</small>
            </div>
          ) : null}
          {data.user?.averageRating ? (
            <div className="flex  gap-1">
              <AiTwotoneStar className="text-[#FFCA28]" />
              <p className="text-sm font-bold text-[#383838]">
                {data.user?.averageRating}
              </p>
            </div>
          ) : null}
          <small className="underline text-[#4E4B4B] ">Seller review</small>
        </div>
        {data.images ? (
          <div className="mt-2">
            <img
              src={data.images[0]}
              alt=""
              className="rounded-lg w-full h-64 object-cover"
            />
            <div className="flex overflow-x-scroll mt-2 hide-scroll-bar">
              <div className="flex flex-nowrap gap-2">
                {data.images.map((img) => (
                  <div key={img} className="inline-block">
                    <div className="w-20 h-20 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                      <img
                        src={img}
                        alt=""
                        className="rounded-lg w-20 h-20 object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-5">
            <PostAction
              count={data.likes!.length.toString()}
              icon={Assets.Like}
              onClick={() => {}}
            />
            <PostAction
              count={data.comments!.length.toString()}
              icon={Assets.Comment}
              onClick={() => {}}
            />
            <PostAction
              count={data.coins!.length.toString()}
              icon={Assets.Coin}
              onClick={() => {}}
            />
            <PostAction count="" icon={Assets.Share} onClick={() => {}} />
          </div>
          <small className="text-[#B4B4B4]">
            {formatDate(data.timestamp!)}
          </small>
        </div>
      </div>
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
