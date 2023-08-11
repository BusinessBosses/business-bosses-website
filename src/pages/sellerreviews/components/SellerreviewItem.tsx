import { ReactNode, useRef, useState } from "react";
import Popup from "reactjs-popup";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosMore } from "react-icons/io";
import { BottomSheet } from "react-spring-bottom-sheet";
import Assets from "../../../assets";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import GreyButton from "../../../common/components/buttons/Greybutton";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import SharePopUp from "../../../common/components/share/SharePopUp";
import GeneralPostsController from "../../../common/controllers/GeneralPostsController";
import formatDate from "../../../common/functions/formatDate";
import trimText from "../../../common/functions/trimText";
import { Post } from "../../../common/interfaces/post";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";

interface Props {
  data: Post;
 
}
const SellerreviewItem = ({ data }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user.profile);




  return (
    <div>
      <div className="pt-5 px-4 bg-white">

        <div className="flex items-start justify-between">
          <div
            onClick={() =>
              navigate(RoutesPath.PublicUserProfile, { state: data.user })
            }
            className="flex items-center gap-3"
          >
            <UserAvatar imageURL={data.user.photoUrl} />
            <div className="flex-grow">
              <p className=" font-semibold flex items-center text-xs md:text-sm lg:text-base capitalize">
                {data.user?.username}
                {data.user?.isSubscribed && (
                  <div className="ml-1">
                    <Assets.Checkmark width={9} />
                  </div>
                )}
              </p>

              <p className="text-xs text-[#777777]">
                {trimText(data.user.bio ?? "", 20)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {data.user?.isSubscribed && (
              <GreyButton onClick={() => { }} text={"Connect"} />
            )}

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
            >
              {
                (((close: any) =>
                  data.user.uid === profile?.uid ? (
                    <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                      <button
                        onClick={() => {
                          close();
                          navigate(RoutesPath.createPost, { state: data });
                        }}
                        className="menu-item"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          close();
                        }}
                        className="menu-item"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                      <button
                        onClick={() => {
                          close();
                          toast.success("User Blocked");
                          GeneralPostsController.blockUser({
                            postId: data.postId,
                          });
                        }}
                        className="menu-item "
                      >
                        Block @{data.user.username}
                      </button>
                      <button
                        onClick={() => {
                          close();
                          toast.success("Post reported");
                          GeneralPostsController.reportPost({
                            postId: data.postId,
                            reason: "",
                          });
                        }}
                        className="menu-item text-primary"
                      >
                        Report Rating
                      </button>
                    </div>
                  )) as unknown) as ReactNode
              }
            </Popup>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-[#303133] break-words">{data.title}</p>

        </div>

        <small className="text-[#B4B4B4]">
              {formatDate(data.timestamp)}
            </small>
      </div>




    </div>
  );
};

export default SellerreviewItem;
