import { ReactNode, useRef, useState } from "react";
import { IoIosMore } from "react-icons/io";
import UserAvatar from "../avatars/UserAvatar";
import Assets from "../../../assets";
import Popup from "reactjs-popup";
import { Forum } from "../../interfaces/forum";
import trimText from "../../functions/trimText";
import formatDate from "../../functions/formatDate";
import { useAppSelector } from "../../../redux/store/store";
import RoutesPath from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import GeneralPostsController from "../../controllers/GeneralPostsController";
import { Comment as CommentStruct } from "../../interfaces/comment";
import FetchStatus from "../fetch_status/FetchStatus";
import Comment from "../comment/Comment";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import SharePopUp from "../share/SharePopUp";
import GreyButton from "../buttons/Greybutton";
import FilledButtonsmall from "../buttons/FilledButtonsmall";
import { ImagesListItem } from "react-spring-lightbox/dist/types/ImagesList";
import ConnectionsController from "../../../pages/connections/controller/ConnectionsController";
import { saveUserData } from "../../../redux/slices/UserSlice";
import { User } from "../../interfaces/user";
import Outlinegrey from "../buttons/Outlinegrey";
import Lightbox from "react-spring-lightbox";
import FilledButton from "../buttons/FilledButton";
import TranslucentDiv from "../buttons/Translucentbutton";
import VisibilitySensor from 'react-visibility-sensor';

interface Props {
  data: Forum;
  onLike?: Function;
  onCoin?: Function;
  onComment?: Function;
  onView: Function;
  onEdit: VoidFunction;
}
const ForumItem = ({ data, onCoin, onLike, onComment, onEdit, onView }: Props) => {
  const profile = useAppSelector((state) => state.user.profile);
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentStruct[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showExpandedImages, setShowExpandedImages] = useState<boolean>(false);
  const [viewCounted, setViewCounted] = useState(false);

  const handleExpanded = () => {
    setShowExpandedImages(true);
  };

  const handleOnVisibilityChange = (isVisible: any) => {
    if (isVisible && !viewCounted) {
      onView(data.forumId);
      setViewCounted(true);
    }
  };

  const images: ImagesListItem[] = (data.images || []).map((imageUrl, index) => ({
    src: imageUrl,
    loading: 'lazy',
    alt: `Image ${index + 1}`,
  }));


  const [currentImageIndex, setCurrentIndex] = useState(0);

  const gotoPrevious = () =>
    currentImageIndex > 0 && setCurrentIndex(currentImageIndex - 1);

  const gotoNext = () =>
    currentImageIndex + 1 < images?.length! &&
    setCurrentIndex(currentImageIndex + 1);

  const connection = async () => {
    if (profile?.connecteds?.includes(data.user?.uid!)) {
      const newUserData: User = {
        ...profile,
        connecteds: profile.connecteds?.filter(
          (ft) => ft !== data.user?.uid!
        ),
        connectedCount: (profile?.connectedCount ?? 0) - 1,
      };
      dispatch(saveUserData(newUserData));
      await ConnectionsController.disConnect(data.user?.uid!);
    } else {
      const newUserData: User = {
        ...profile,
        connecteds: [...profile?.connecteds!, data.user?.uid],
        connectedCount: (profile?.connectedCount ?? 0) + 1,
      } as User;
      dispatch(saveUserData(newUserData));
      await ConnectionsController.connect(data.user?.uid!);
    }
  };

  const handleBlockClick = () => {
    setShowConfirmation(true);
  };
  const handleReportClick = () => {
    setShowReport(true);
  };

  const handleConfirmBlock = () => {
    toast.success("User Blocked");
    GeneralPostsController.blockUser({
      postId: data.forumId,
    });
    setShowConfirmation(false);
  };

  const handleConfirmReport = () => {
    toast.success("Post reported");
    GeneralPostsController.reportPost({
      postId: data.forumId,
      reason: "",
    });
    setShowReport(false);
  };


  const handleButtonClick = () => {
    const confirmMessage = 'You need to sign in or create an account to be able to use this feature';
    if (window.confirm(confirmMessage)) {
      navigate(RoutesPath.login)
    } else {

    }
  };

  const handleCancelBlock = () => {
    setShowConfirmation(false);
  };

  const handleCancelReport = () => {
    setShowReport(false);
  };

  const fetchComments = async () => {
    if (comments.length) return;
    setLoading(true);
    setErr(false);
    const response = await GeneralPostsController.fetchComments(data.forumId);
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
      postId: data.forumId,
      timestamp: Date.now(),
      userId: profile!.uid,
    };
    setComments([...comments, newComment]);
    const structuredComment = {
      comment: commentInputRef.current?.value.trim(),
      postId: data.forumId,
      receiverUid: data.user!.uid,
      timestamp: Date.now(),
    };
    if (onComment) {
      onComment(structuredComment);
    }
    commentInputRef.current.value = "";

    await GeneralPostsController.comment(structuredComment);
  };
  return (
    <div onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
      handleButtonClick : () => { }} >
      <div className="bg-black mobilepopup justify-center" style={{ position: "relative" }}>
        {showConfirmation && (
          <div className="confirmation-overlay">

            <div className="confirmation-dialog rounded-xl mx-5 bg-white">
              <div className="font-bold text-lg text-center pt-10">Do you want to block user?</div>
              <div className="text-center text-sm lg:text-base pt-2 pl-10 pr-10">You will no longer see {data.user?.username}'s posts and comments on your feed</div>
              <div className="flex justify-center pt-5 pb-10">
                <button onClick={handleCancelBlock} style={{ color: 'grey', fontWeight: 'bold' }}>Cancel</button>
                <div className="ml-5">
                  <FilledButtonsmall onClick={handleConfirmBlock} text={"Block"} /></div>
              </div>
            </div>
          </div>
        )}
        {showReport && (
          <div className="confirmation-overlay">

            <div className="confirmation-dialog rounded-xl mx-5 bg-white">
              <div className="font-bold text-lg text-center pt-10">Do you want to report post?</div>
              <div className="text-center text-sm lg:text-base pt-2 pl-10 pr-10">The post will be reported to admin to evaluate if it violates any community policy</div>
              <div className="flex justify-center pt-5 pb-10">
                <button onClick={handleCancelReport} style={{ color: 'grey', fontWeight: 'bold' }}>Cancel</button>
                <div className="ml-5">
                  <FilledButtonsmall onClick={handleConfirmReport} text={"Report"} /></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="pt-5 px-4 bg-white">
          <SharePopUp
            url={`${window.location.href}forum?id=${data.forumId}`}
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
                  className="outline-none border-none outline-none w-full "
                  placeholder="Comment..."
                  name=""
                  id=""
                />
                <button onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                  () => { } : makeComment}>
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
            <div
              onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                () => { } : () =>
                  navigate(RoutesPath.PublicUserProfile, { state: data.user })
              }
              className="flex items-center "
            >
              <UserAvatar imageURL={data.user?.photoUrl}
                isRanked={data.user?.isRanked}
              />
               <div className="w-3"></div>
              <div className="flex-grow">
                <p className="font-semibold flex items-center text-sm md:text-sm lg:text-base capitalize">
                  {data.user?.name}
                  {data.user?.isSubscribed && (
                    <div className="ml-1">
                      <Assets.Checkmark width={9} />
                    </div>
                  )}
                </p>

                <p className="text-sm lg:text-base text-[#777777]">
                  {trimText(data.user?.bio ?? "", 20)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              {data.user?.isSubscribed && (
                !profile?.connecteds?.includes(data.user.uid!) ? (
                  <GreyButton
                    onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                      () => { } : connection}
                    text="Connect"
                  />
                ) : (
                  <Outlinegrey
                    onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                      () => { } : () => {
                        navigate(RoutesPath.refer, { state: data.user?.uid });
                      }}
                    text="Refer"
                  />
                )

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
              // overlayStyle={{
              //   background: "rgba(0, 0, 0, 0.8)",
              //   zIndex: 1000,
              // }}
              >
                {
                  (((close: any) =>
                    data.user!.uid === profile?.uid ? (
                      <div className=" bg-white shadow-xl rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                        <button
                          onClick={() => {
                            close();
                            onEdit();
                          }}
                          className="menu-item border-none outline-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            close();


                          }}
                          className="menu-item border-none outline-none"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className=" bg-white shadow-xl rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                        <button
                          onClick={() => {
                            close();
                            handleBlockClick();
                          }}
                          className="menu-item border-none outline-none font-bold text-[#2D93EC]"
                        >
                          {'Block @' + data.user?.username}
                        </button>
                        <button
                          onClick={() => {
                            close();
                            handleReportClick();
                          }}
                          className="menu-item border-none outline-none text-primary font-bold"
                        >
                          Report this post
                        </button>
                      </div>
                    )) as unknown) as ReactNode
                }
              </Popup>

            </div>
          </div>
          <div className="mt-2">
            <p className=" text-sm lg:text-base font-[700] text-black break-words">
              {data.title}
            </p>
            <p className="= text-sm lg:text-base text-[#303133] break-words">
              {data.description}
            </p>
            {data.industry ? (
  <div className="text-[#4E4B4B] text-xs my-2 px-3 py-1 rounded-lg" style={{ backgroundColor: '#f1f1f1', display: 'inline-block' }}>
    {data.industry}
  </div>
) : null}


            {data.images ? (
              <div className="mt-2">
                <Lightbox className="lg:p-10 p-5" style={{ background: 'rgba(0, 0, 0, 0.98)' }}
                  isOpen={showExpandedImages}
                  onPrev={gotoPrevious}
                  onNext={gotoNext}
                  images={images}
                  currentIndex={currentImageIndex}
                  renderFooter={() => (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowExpandedImages(false)}>
                    <TranslucentDiv />
                  </div>
                  )}
                  // renderFooter={() => (<CustomFooter />)}
                  renderPrevButton={() => (<Assets.Backbutton style={{ position: 'relative', zIndex: '500' }} onClick={gotoPrevious} />)}
                  renderNextButton={() => (
                    <Assets.Backbutton
                      style={{ transform: 'rotate(180deg)' }}
                      onClick={gotoNext}
                    />
                  )}

                  // renderImageOverlay={() => (<ImageOverlayComponent >)}

                  /* Add styling */
                  // className="cool-class"
                  // style={{ background: "grey" }}

                  /* Handle closing */
                  // onClose={handleClose}

                  /* Use single or double click to zoom */
                  // singleClickToZoom

                  /* react-spring config for open/close animation */
                  pageTransitionConfig={{
                    from: { transform: "scale(0.75)", opacity: 0 },
                    enter: { transform: "scale(1)", opacity: 1 },
                    leave: { transform: "scale(0.75)", opacity: 0 },
                    config: { mass: 1, tension: 320, friction: 32 }
                  }}
                />
                <img
                  onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                    () => { } : () => { handleExpanded(); }}
                  src={data.images[0]}
                  alt=""
                  className="rounded-lg w-full h-64 object-cover"
                />
                <div className="flex overflow-x-hidden mt-2 hide-scroll-bar">
                  <div className="flex flex-nowrap gap-2">
                    {data.images.map((img, index) => (
                      <div key={img} className="inline-block">
                        {index === 0 ? null : (
                          <div className="max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            <img
                              onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                                () => { } : () => { handleExpanded(); }}
                              src={img}
                              alt=""
                              className="rounded-lg w-20 h-20 object-cover"
                            />
                          </div>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-5 flex items-center justify-between mb-3">
              <div className="flex">
                <PostAction
                  count={data.likes!.length.toString()}
                  icon={
                    data.likes!.includes(profile!.uid)
                      ? Assets.LikeFilled
                      : Assets.Like
                  }
                  onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                    () => { } : () => {
                      if (onLike) {
                        onLike(data.forumId);
                      }
                    }}
                />
                 <div className="w-5"></div>
                <PostAction
                  count={data.comments!.length.toString()}
                  icon={Assets.Comment}
                  onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                    () => { } : () => {
                      fetchComments();
                      setOpen(true);
                    }}
                />
                 <div className="w-5"></div>
                <PostAction
                  count={data.coins!.length.toString()}
                  icon={Assets.Coin}
                  onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                    () => { } : () => {
                      if (onCoin) {
                        onCoin(data.forumId);
                      }
                    }}
                />
                 <div className="w-5"></div>
                <VisibilitySensor onChange={handleOnVisibilityChange}>
                  <PostAction
                    count={data.views!.toString()}
                    icon={Assets.Viewsicon}
                    onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                      () => { } : () => {

                      }}
                  />
                </VisibilitySensor>
                <div className="w-5"></div>
                <PostAction
                  count=""
                  icon={Assets.Share}
                  onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                    () => { } : () => {
                      setShowShareDialog(true);
                    }}
                />
              </div>
              <small className="text-[#B4B4B4]">
                {formatDate(data.timestamp!)}
              </small>
            </div>
          </div>
        </div>
        <div
          className="mobile-only "
          style={{ height: "7px", width: "100%", background: "#f4f4f4" }}
        ></div>
        <div
          className="computer-only"
          style={{
            height: "1.2px",
            width: "100%",
            background: "rgba(0, 0, 0, 0.1)",
          }}
        ></div>
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
function dispatch(arg0: { payload: User; type: "user/saveUserData"; }) {
  throw new Error("Function not implemented.");
}

