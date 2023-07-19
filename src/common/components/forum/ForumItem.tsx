import { ReactNode } from "react";
import { IoIosMore } from "react-icons/io";
import UserAvatar from "../avatars/UserAvatar";
import Assets from "../../../assets";
import Popup from "reactjs-popup";
import { Forum } from "../../interfaces/forum";
import trimText from "../../functions/trimText";
import formatDate from "../../functions/formatDate";
interface Props {
  data: Forum;
}
const ForumItem = ({ data }: Props) => {
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
            <p className="text-[#333333] text-lg capitalize">
              {data.user?.username}
            </p>
            <p className="text-sm text-[#777777]">
              {trimText(data.user?.bio ?? "", 20)}
            </p>
          </div>
        </div>
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
      <div className="mt-2">
        <p className=" font-[500] text-black break-words">{data.title}</p>
        <p className="text-sm text-[#303133] break-words">{data.description}</p>
        {data.images ? (
          <div className="mt-2">
            <img
              crossOrigin="anonymous"
              loading="lazy"
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

export default ForumItem;

interface ForumActionProps {
  icon: any;
  count: string;
  active?: boolean;
  onClick: VoidFunction;
}
const PostAction = ({ count, icon, active, onClick }: ForumActionProps) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onClick}>
        <img src={icon} alt="" />
      </button>
      <p className="text-sm">{count}</p>
    </div>
  );
};
