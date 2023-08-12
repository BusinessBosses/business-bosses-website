import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import Assets from "../../../../assets";
import { MdLocationPin } from "react-icons/md";
import { AiTwotoneStar } from "react-icons/ai";
import { Market } from "../../../../common/interfaces/Market";
import trimText from "../../../../common/functions/trimText";
import formatDate from "../../../../common/functions/formatDate";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../redux/store/store";
import { ReactNode, useRef, useState } from "react";
import { Comment as CommentStruct } from "../../../../common/interfaces/comment";
import RoutesPath from "../../../../constants/Routes";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import GeneralPostsController from "../../../../common/controllers/GeneralPostsController";
import SharePopUp from "../../../../common/components/share/SharePopUp";
import { BottomSheet } from "react-spring-bottom-sheet";
import FetchStatus from "../../../../common/components/fetch_status/FetchStatus";
import Comment from "../../../../common/components/comment/Comment";
import OutlinedButton from "../../../../common/components/buttons/OutlinedButton";
interface Props {
  data: Market;
  onLike: Function;
  onCoin: Function;
  onComment: Function;
}
const MarketItem = ({ data, onCoin, onComment, onLike }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user.profile);
  const [comments, setComments] = useState<CommentStruct[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

  const fetchComments = async () => {
    if (comments.length) return;
    setLoading(true);
    setErr(false);
    const response = await GeneralPostsController.fetchComments(data.marketId);
    if (response.success) {
      setComments(response.data.rows);
    } else {
      setErr(true);
    }
    setLoading(false);
  };

  const makeComment = async () => {
    if (!commentInputRef.current?.value.trim()) return;
    const commentId = v4();
    const newComment: CommentStruct = {
      user: profile!,
      comment: commentInputRef.current?.value.trim(),
      commentId,
      postId: data.marketId,
      timestamp: Date.now(),
      userId: profile!.uid,
    };
    setComments([...comments, newComment]);
    const structuredComment = {
      comment: commentInputRef.current?.value.trim(),
      postId: data.marketId,
      receiverUid: data.user!.uid,
      timestamp: Date.now(),
    };
    onComment(structuredComment);
    commentInputRef.current.value = "";

    await GeneralPostsController.comment(structuredComment);
  };
  return (

    <div>
      <div className="mt-5 px-4">
        <SharePopUp
          url={`${window.location.href}post?id=${data.marketId}`}
          onClose={() => setShowShareDialog(false)}
          open={showShareDialog}
        />
        <BottomSheet
          scrollLocking={true}
          onDismiss={() => setOpen(false)}
          maxHeight={1000}
          open={open}
          footer={
            <div className="flex items-center gap-2">
              <input
                ref={commentInputRef}
                type="text"
                className="outline-none border-none w-full "
                placeholder="Comment..."
                name=""
                id=""
              />
              <button onClick={makeComment}>
                <Assets.Send />
              </button>
            </div>
          }
        >
          <div className="h-[50vh] overflow-y-auto">
            {(loading || err) && (
              <FetchStatus
                error={err}
                errorMessage="Something went wrong!!"
                loading={loading}
                onReload={() => { }}
              />
            )}
            <div className="px-4">
              {comments.map((comment: CommentStruct, index: number) => {
                return <Comment comment={comment} key={index} />;
              })}
            </div>
          </div>
        </BottomSheet>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar
              imageURL={
                data.user?.photoUrl ??
                "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
            />
            <div className="">
              <p className="font-semibold flex items-center text-sm md:text-sm lg:text-base capitalize">
                {data.user?.username}
                {data.user?.isSubscribed && <div className="ml-1"><Assets.Checkmark width={9} /></div>}
              </p>
              <p className="text-sm text-[#777777] lg:text-base">
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
          >
            {
              (((close: any) =>
                data.user?.uid === profile?.uid ? (
                  <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                    <button
                      onClick={() => {
                        close();
                        navigate(RoutesPath.CreateListing, { state: data });
                      }}
                      className="menu-item"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        close();
                        navigate(RoutesPath.promotePost, {
                          state: data.marketId,
                        });
                      }}
                      className="menu-item"
                    >
                      Promote
                    </button>
                  </div>
                ) : (
                  <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                    <button
                      onClick={() => {
                        close();
                        toast.success("User Blocked");
                        // GeneralPostsController.blockUser({ postId: data.postId });
                      }}
                      className="menu-item"
                    >
                      Block @{data.user?.username}
                    </button>
                    <button
                      onClick={() => {
                        close();
                        toast.success("Post reported");
                        // GeneralPostsController.reportPost({
                        //   postId: data.postId,
                        //   reason: "",
                        // });
                      }}
                      className="menu-item text-primary"
                    >
                      Report this Post
                    </button>
                    <button
                      onClick={() => {

                      }}
                      className="menu-item"
                    >
                      Visit Store
                    </button>
                  </div>
                )) as unknown) as ReactNode
            }
          </Popup>
        </div>
        <div className="mt-2">
          {data.promote ? (
            <p className="text-[#4E4B4B] text-xs mb-2">Sponsored</p>
          ) : null}
          <p className="text-[#232324] font-bold my-1">${data.price}</p>
          <p className="text-sm text-[#303133] lg:text-base break-words">{data.description}</p>
          <div className="my-1 flex items-center gap-3">
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


          </div>
          <div onClick={()=>navigate(RoutesPath.sellerreview)} className="flex gap-2">{data.user?.averageRating ? (
            <div className="flex  gap-1">
              <AiTwotoneStar className="text-[#FFCA28]" />
              <p className="text-sm font-bold text-[#383838]">
                {data.user?.averageRating}
              </p>
            </div>
          ) : null}
            <small className="underline text-[#878787] font-[700] lg:text-sm">Seller reviews</small></div>

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
          <div className="mt-5 flex items-center justify-between mb-3">
            <div className="flex gap-5">
              <PostAction
                count={data.likes!.length.toString()}
                icon={
                  data.likes?.includes(profile!.uid)
                    ? Assets.LikeFilled
                    : Assets.Like
                }
                onClick={() => {
                  onLike(data.marketId);
                }}
              />
              <PostAction
                count={data.comments!.length.toString()}
                icon={Assets.Comment}
                onClick={() => {
                  fetchComments();
                  setOpen(true);
                }}
              />
              <PostAction
                count={data.coins!.length.toString()}
                icon={Assets.Coin}
                onClick={() => {
                  onCoin(data.marketId);
                }}
              />
              <PostAction
                count=""
                icon={Assets.Share}
                onClick={() => {
                  setShowShareDialog(true);
                }}
              />
            </div>

            <OutlinedButton onClick={() => { }} text={"Message Seller"} />
          </div>
        </div>

      </div>
      <div className="mobile-only " style={{ height: "7px", width: "100%", background: "#f4f4f4" }}></div>
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
