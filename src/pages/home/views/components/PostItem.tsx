import { ReactNode, useRef, useState } from "react";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import Assets from "../../../../assets";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import Popup from "reactjs-popup";
import { Post } from "../../../../common/interfaces/post";
import trimText from "../../../../common/functions/trimText";
import formatDate from "../../../../common/functions/formatDate";
import { useAppSelector } from "../../../../redux/store/store";
import { BottomSheet } from "react-spring-bottom-sheet";
import FetchStatus from "../../../../common/components/fetch_status/FetchStatus";
import Comment from "../../../../common/components/comment/Comment";
import { Comment as CommentStruct } from "../../../../common/interfaces/comment";
import GeneralPostsController from "../../../../common/controllers/GeneralPostsController";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import SharePopUp from "../../../../common/components/share/SharePopUp";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import GreyButton from "../../../../common/components/buttons/Greybutton";
interface Props {
  data: Post;
  onLike: Function;
  onCoin: Function;
  onComment: Function;
}
const PostItem = ({ data, onCoin, onLike, onComment }: Props) => {
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
    const response = await GeneralPostsController.fetchComments(data.postId);
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
      postId: data.postId,
      timestamp: Date.now(),
      userId: profile!.uid,
    };
    setComments([...comments, newComment]);
    const structuredComment = {
      comment: commentInputRef.current?.value.trim(),
      postId: data.postId,
      receiverUid: data.user.uid,
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
          url={`${window.location.href}post?id=${data.postId}`}
          onClose={() => setShowShareDialog(false)}
          open={showShareDialog}
        />
        <div className="mobile-only"><BottomSheet
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
        </BottomSheet></div>
        <div className="computer-only"><BottomSheet
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
        </BottomSheet></div>

        <div className="flex items-start justify-between">
          <div
            onClick={() =>
              navigate(RoutesPath.PublicUserProfile, { state: data.user })
            }
            className="flex items-center gap-3"
          >
            <UserAvatar
              imageURL={
                data.user.photoUrl ??
                "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
            />
            <div className="flex-grow">
              <p className="text-gray-700 font-semibold flex items-center text-base md:text-sm lg:text-base capitalize">
                {data.user?.username}
                {data.user?.isSubscribed && <div className="ml-1"><Assets.Checkmark width={9} /></div>}
              </p>

              <p className="text-sm text-[#777777]">
                {trimText(data.user.bio ?? "", 20)}
              </p>
            </div>
          </div>
          <GreyButton onClick={()=>{}} text={"Connect"} />

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
                        navigate(RoutesPath.promotePost, { state: data.postId });
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
                        GeneralPostsController.blockUser({ postId: data.postId });
                      }}
                      className="menu-item"
                    >
                      Block User
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
                      className="menu-item"
                    >
                      Report Post
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
          <p className="text-sm text-[#303133] break-words">{data.title}</p>
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
                count={data.likes.length.toString()}
                icon={
                  data.likes.includes(profile!.uid)
                    ? Assets.LikeFilled
                    : Assets.Like
                }
                onClick={() => {
                  onLike(data.postId);
                }}
              />
              <PostAction
                count={data.comments.length.toString()}
                icon={Assets.Comment}
                onClick={() => {
                  fetchComments();
                  setOpen(true);
                }}
              />
              <PostAction
                count={data.coins.length.toString()}
                icon={Assets.Coin}
                onClick={() => {
                  onCoin(data.postId);
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
            <small className="text-[#B4B4B4]">{formatDate(data.timestamp)}</small>
          </div>
        </div>



      </div>
      <div className="mobile-only " style={{ height: "7px", width: "100%", background: "#f4f4f4" }}></div>
      <div className="computer-only" style={{ height: "1.2px", width: "100%", background: "rgba(0, 0, 0, 0.1)" }}></div>
    </div>
  );
};

export default PostItem;

interface PostActionProps {
  icon: any;
  count: string;
  active?: boolean;
  onClick: VoidFunction;
}
const PostAction = ({ count, icon, active, onClick }: PostActionProps) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onClick}>
        <img src={icon} alt="" />
      </button>
      <p className="text-sm">{count}</p>
    </div>
  );
};
