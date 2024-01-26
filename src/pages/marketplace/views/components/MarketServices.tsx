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
import { ImagesListItem } from "react-spring-lightbox/dist/types/ImagesList";
import Lightbox from "react-spring-lightbox";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import FilledButtonsmall from "../../../../common/components/buttons/FilledButtonsmall";
import TranslucentDiv from "../../../../common/components/buttons/Translucentbutton";
import MarketController from "../../controller/MarketController";
interface Props {
  data: Market;
  onLike: Function;
  onCoin: Function;
  onComment: Function;
}
const MarketServices = ({ data, onCoin, onComment, onLike }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user.profile);
  const [comments, setComments] = useState<CommentStruct[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [showExpandedImages, setShowExpandedImages] = useState<boolean>(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showdelConfirmation, setShowdelConfirmation] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleBlockClick = () => {
    setShowConfirmation(true);
  };
  const handleReportClick = () => {
    setShowReport(true);
  };
  const handleDeleteClick = () => {
    setShowdelConfirmation(true);
  };

  const handleExpanded = () => {
    setShowExpandedImages(true);
  };


  const handleCancelBlock = () => {
    setShowConfirmation(false);
  };

  const handleCancelReport = () => {
    setShowReport(false);
  };

  const handleConfirmReport = () => {
    toast.success("Post reported");
    GeneralPostsController.reportPost({
      postId: data.marketId,
      reason: "",
    });
    setShowReport(false);
  };

  const handledelConfirm = () => {
    toast.success("Post Deleted Successfully");
    // GeneralPostsController.deletePost({
    // });
    setShowdelConfirmation(false);
  };


  const handleConfirmBlock = () => {
    toast.success("User Blocked");
    GeneralPostsController.blockUser({
      postId: data.marketId,
    });
    setShowConfirmation(false);
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


  const handleButtonClick = () => {
    const confirmMessage = 'You need to sign in or create an account to be able to use this feature';
    if (window.confirm(confirmMessage)) {
      navigate(RoutesPath.login)
    } else {

    }
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
      <div className="mt-5 px-4" onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
        handleButtonClick : () => { }}>
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
        {showdelConfirmation && (
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
          <div className="flex items-center" onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            () => { } : () =>
              navigate(RoutesPath.PublicUserProfile, { state: data.user })
          }>
            <UserAvatar
              imageURL={
                data.user?.photoUrl
              }
            />
             <div className="w-3"></div>
            <div className="">
              <p className="font-semibold flex items-center text-sm md:text-sm lg:text-base capitalize">
                {data.user?.name ?? data.user?.username}
                {data.user!.isSubscribed && <div className="ml-1"><Assets.Checkmark width={9} /></div>}
              </p>
              <p className="text-sm text-[#777777] lg:text-base">
                {trimText(data.user?.bio ?? "", 20)}
              </p>
            </div>
          </div>
          <Popup
            trigger={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
              <div></div> :
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
                    <button
                      onClick={() => {
                        MarketController.deletelisting(data.marketId)
                          toast.success("Post Deleted Successfully")
                          close();
                      }}
                      className="menu-item text-primary"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                    <button
                      onClick={() => {
                        close();
                        handleBlockClick();
                        // GeneralPostsController.blockUser({ postId: data.postId });
                      }}
                      className="menu-item border-none outline-none font-bold text-[#2D93EC]"
                    >
                      Block @{data.user?.username}
                    </button>
                    <button
                      onClick={() => {
                        close();
                        handleReportClick();
                        // GeneralPostsController.reportPost({
                        //   postId: data.postId,
                        //   reason: "",
                        // });
                      }}
                      className="menu-item border-none outline-none text-primary font-bold"
                    >
                      Report this Post
                    </button>
                    <button
                      onClick={() => {

                      }}
                      className="menu-item font-bold"
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
          <div className="flex">
            <p className="text-[#232324] font-bold my-1">{data.category} - ${data.price}</p>
            {data.discount !== null && (
              <div className="ml-3 flex items-center rounded-lg px-3 py-1 bg-[#D6F8E6] font-bold text-[#64AB5B]" style={{ fontSize: "12px" }}>
                {data.discount}% off
              </div>
            )}


          </div>

          <p className="text-sm text-[#303133] lg:text-base break-words">{data.description}</p>
          <div className="my-1 flex items-center gap-3">
            {data.location ? (
              <div className="flex text-[#878787] gap-1">
                <img src={Assets.timelapseicon} width={10} />
                <small>{data.location}</small>
              </div>
            ) : null}


          </div>
          <div onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
            () => { } : () => navigate(RoutesPath.sellerreview, { state: data.user })} className="flex gap-2">{data.user?.averageRating ? (
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
              <Lightbox className="lg:p-10 p-5 " style={{ background: 'rgba(0, 0, 0, 0.98)' }}
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
                count={data.likes.length.toString()}
                icon={
                  data.likes.includes(profile!.uid)
                    ? Assets.LikeFilled
                    : Assets.Like
                }
                onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                  () => { } : () => {
                    onLike(data.marketId);
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
                    onCoin(data.marketId);
                  }}
              />
               <div className="w-5"></div>
              <PostAction
                count={data.views!.toString()}
                icon={Assets.Viewsicon}
                onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                  () => { } : () => {

                  }}
              />
            
              {/* <div className="computer-only">
              <div className="w-5"></div>
                <PostAction
                  count=""
                  icon={Assets.Share}
                  onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                    () => { } : () => {
                      setShowShareDialog(true);
                    }}
                />
              </div> */}
            </div>

            {data.userId !== profile?.uid ?
              <div className="text-xs text-primary lg:text-sm font-bold border rounded-lg lg:rounded-xl p-1.5 cursor-pointer"
                style={{ borderColor: '#F21C29', borderWidth: '2px' }}
                onClick={profile?.email === `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                  () => { } : () => { navigate(RoutesPath.ChatRoom, { state: { user: data } }); }}>
                Message Seller
              </div>
              : null}


          </div>
        </div>

      </div>
      <div className="mobile-only " style={{ height: "7px", width: "100%", background: "#f4f4f4" }}></div>
      <div className="computer-only" style={{ height: "1.2px", width: "100%", background: "rgba(0, 0, 0, 0.1)" }}></div>
    </div>
  );
};

export default MarketServices;

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
