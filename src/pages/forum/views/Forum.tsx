import { useEffect, useRef, useState } from "react";
import ForumCard from "../../../common/components/forum/ForumCard";
import ForumItem from "../../../common/components/forum/ForumItem";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import { Industry } from "../../../common/interfaces/industry";
import { useLocation, useNavigate } from "react-router-dom";
import ForumController from "../controller/ForumController";
import { Forum as ForumProp } from "../../../common/interfaces/forum";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import GeneralPostsController, {
  CoinStruct,
  LikeStruct,
} from "../../../common/controllers/GeneralPostsController";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { saveUserData } from "../../../redux/slices/UserSlice";
import { Comment } from "../../../common/interfaces/comment";
import { Socket } from "socket.io-client";
import AppConstants from "../../../constants/consts";
import Popup from "reactjs-popup";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { MdCancel } from "react-icons/md";
import Assets from "../../../assets";
import { AiOutlineClose } from "react-icons/ai";
import CommunitiesController from "../../communities/controller/CommunitiesController";
import RoutesPath from "../../../constants/Routes";
import FilledInput from "../../../common/components/inputs/FilledInput";
import FilledTextarea from "../../../common/components/inputs/FilledTextarea";
import serviceApi from "../../../services/serviceApi";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import Bossoftheweekpopup from "../../popups/Bossoftheweekpopup";
import Learningpopup from "../../popups/Learningpopup";
import Opportunities from "../../communities/views/Opportunities";
import Opportunitiespopup from "../../popups/Opportunitiespopup";
import FilledInputcommunities from "../../../common/components/inputs/FilledInputcommunities";
import FilledTextareacommunities from "../../../common/components/inputs/FilledTextareacommunities";
import FormModal from "./components/FormModal";
interface Props {
  socket: Socket;
}
const Forum = ({ socket }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [forums, setForums] = useState<ForumProp[]>([]);
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const updateForum = (action: { index: number; forum: ForumProp }) => {
    const forumsDP = forums.map((mp: ForumProp, index: number) => {
      if (index === action.index) {
        return action.forum;
      } else {
        return mp;
      }
    });

    setForums(forumsDP);
  };

  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleOutsideInteraction);
      document.addEventListener("touchstart", handleOutsideInteraction);
    } else {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [isPopupOpen]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const fetchForums = async (industryId: string) => {
    setLoading(true);
    setErr(false);
    const response = await ForumController.fetchForums(industryId, page);
    if (response.success) {
      setPage(page + 1);
      setCount(response.data.count);
      setForums(
        response.data.rows.map((mp: ForumProp) => ({
          ...mp,
          coins: mp.coins!.map((cn: any) => cn.userId),
          likes: mp.likes!.map((lk: any) => lk.userId),
        }))
      );
    } else {
      setErr(true);
    }

    setLoading(false);
  };

  const onLike = (args: LikeStruct, postIndex: number) => {
    let forum = forums[postIndex];
    if (forum.likes!.includes(profile?.uid!)) {
      forum = {
        ...forum,

        likes: forum.likes!.filter((ft) => ft !== profile!.uid),
      };
    } else {
      forum = {
        ...forum,
        likes: [...forum.likes!, profile!.uid],
      };
    }
    updateForum({ index: postIndex, forum });
    GeneralPostsController.like(args, socket);
  };

  const onCoin = (args: CoinStruct, postIndex: number) => {
    let forum = forums[postIndex];
    if (forum.coins!.includes(profile?.uid!)) {
      forum = {
        ...forum,
        coins: forum.coins!.filter((ft) => ft !== profile!.uid),
      };
      dispatch(
        saveUserData({
          ...profile!,
          coinscount: profile!.coinscount! + 1,
        })
      );
    } else {
      forum = {
        ...forum,
        coins: [...forum.coins!, profile!.uid],
      };
      dispatch(
        saveUserData({
          ...profile!,
          coinscount: profile!.coinscount! - 1,
        })
      );
    }
    updateForum({ index: postIndex, forum });
    GeneralPostsController.coin(args, socket);
  };

  const onComment = (comment: Comment, postIndex: number) => {
    let forum = forums[postIndex];
    forum = {
      ...forum,
      comments: [...forum.comments!, comment],
    };
    updateForum({ index: postIndex, forum });
  };
  useEffect(() => {
    const state: Industry = location.state;
    if (!!!state) {
      navigate(-1);
    } else {
      setIndustry(state);
      fetchForums(state.industryId!);
    }
  }, []);
  const [stateProps, setStateProps] = useState<ForumProp | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const boostPostRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const removeImage = (name: string) => {
    const newImageSet = images.filter((ft) => ft.name !== name);
    setImages(newImageSet);
  };

  const createPost = async () => {
    if (processing) return;
    if (
      !CommunitiesController.validatePostField({
        description: descriptionRef.current?.value.trim() ?? "",
        title: titleRef.current?.value.trim() ?? "",
        industryId: industry?.industryId,
        timestamp: Date.now(),
      })
    )
      return;
    setProcessing(true);
    if (images.length) {
      const fileUrls = await CommunitiesController.uploadFiles(images);
      if (fileUrls) {
        const response = await CommunitiesController.createBossup({
          timestamp: Date.now(),
          description: descriptionRef.current?.value.trim()!,
          industryId: industry?.industryId,
          title: titleRef.current?.value.trim()!,
          images: fileUrls,
        });
        if (response.success) {
          setForums([
            {
              ...response.data,
              coins: [],
              likes: [],
              comments: [],
              user: {
                username: profile!.username,
                email: profile?.email,
                uid: profile?.uid,
                bio: profile!.bio,
              },
            },
            ...forums,
          ]);

          if (boostPostRef.current?.checked) {
            navigate(RoutesPath.promotePost);
          } else {
            setOpenModal(false);
          }
        }
      }
    } else {
      const response = await CommunitiesController.createBossup({
        timestamp: Date.now(),
        description: descriptionRef.current?.value.trim()!,
        industryId: industry?.industryId,
        title: titleRef.current?.value.trim()!,
      });
      if (response.success) {
        setForums([
          {
            ...response.data,
            coins: [],
            likes: [],
            comments: [],
            user: {
              username: profile!.username,
              email: profile?.email,
              uid: profile?.uid,
              bio: profile!.bio,
            },
          },
          ...forums,
        ]);
        if (boostPostRef.current?.checked) {
          navigate(RoutesPath.promotePost);
        } else {
          setOpenModal(false);
        }
      }
    }
    setProcessing(false);
  };

  const updatePostFn = async () => {
    if (
      !CommunitiesController.validatePostField({
        description: descriptionRef.current?.value.trim() ?? "",
        industryId: stateProps?.industryId!,
        title: titleRef.current?.value.trim() ?? "",
      })
    )
      return;
    setProcessing(true);

    const response = await CommunitiesController.updateBossup(
      stateProps!.forumId,
      {
        description: descriptionRef.current?.value.trim()!,
        title: titleRef.current?.value.trim()!,
      }
    );
    if (response.success) {
      const postIndex = forums.findIndex(
        (fd) => fd.forumId === stateProps?.forumId
      );
      if (postIndex !== -1) {
        const newForum = forums.map((mp, index) => {
          if (index === postIndex) {
            return {
              ...mp,
              description: descriptionRef.current?.value.trim()!,
              title: titleRef.current?.value.trim() ?? "",
            } as ForumProp;
          } else {
            return mp;
          }
        });
        setForums(newForum);
      }
      setOpenModal(false);
    }
    setProcessing(false);
  };
  const [openModal, setOpenModal] = useState<boolean>(false);
  const joinIndustry = async () => {
    if (!!industry?.joinedUsers?.includes(profile!.uid)) {
      const newJoinedUsers = industry.joinedUsers.filter(
        (ft) => ft !== profile?.uid
      );
      setIndustry({ ...industry, joinedUsers: newJoinedUsers });
      dispatch(
        saveUserData({
          ...profile!,
          interests:
            profile?.interests?.filter(
              (ft) => ft.industryId !== industry.industryId
            ) ?? [],
        })
      );
    } else {
      // alert("here");
      // setIndustry({
      //   ...industry,
      //   joinedUsers: [...industry?.joinedUsers!, profile!.uid],
      // });
      setIndustry({
        ...industry,
        joinedUsers: industry?.joinedUsers
          ? [...industry?.joinedUsers!, profile!.uid]
          : [profile!.uid],
      });
      dispatch(
        saveUserData({
          ...profile!,
          interests: [...profile?.interests!, industry!],
        })
      );
    }
    await serviceApi.update(
      `/industry/join-leave-industry/${industry?.industryId}`
    );
  };
  return (
    <div>
      <FormModal
        closeModal={() => setOpenModal(false)}
        createPost={createPost}
        descriptionRef={descriptionRef}
        images={images}
        industry={industry!}
        openModal={openModal}
        processing={processing}
        removeImage={removeImage}
        setImages={(imgs: File[]) => setImages(imgs)}
        stateProps={stateProps ?? undefined}
        titleRef={titleRef}
        updatePostFn={updatePostFn}
      />
      <div className="mobile-only">
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
            borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <CommonPageHeader title={industry?.industry ?? ""} />
          <div className="mobile-only">
            {isPopupOpen && (
              <div className="overlay">
                <div
                  ref={popupRef}
                  className="mobilepopup"
                  style={{ overflowY: "scroll" }}
                >
                  {industry?.categoryId === AppConstants.LEARNINGID ? (
                    <Learningpopup />
                  ) : (
                    <Opportunitiespopup />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {industry ? (
          <ForumCard
            onCreate={() => {
              setOpenModal(true);
            }}
            createLabel={
              industry.categoryId === AppConstants.LEARNINGID
                ? "Start a topic"
                : "Share Opportunities"
            }
            banner={industry?.photo!}
            didJoin={!!industry.joinedUsers?.includes(profile!.uid)}
            label={industry?.description ?? "Industry description"}
            members={industry?.joinedUsers?.length ?? 0}
            onJoin={joinIndustry}
            topics={count}
            aboutontap={openPopup}
            aboutontaptext={"Info"}
            topicsicon={<Assets.Topicsicon />}
            topicstext={
              industry.categoryId === AppConstants.LEARNINGID
                ? "Topics"
                : "Opport."
            }
          />
        ) : null}
        {loading ? (
          <FetchStatus
            error={false}
            errorMessage="Something went wrong!!"
            loading={true}
            onReload={() => {}}
          />
        ) : null}
        {err ? (
          <FetchStatus
            error={true}
            errorMessage="Something went wrong!!"
            loading={false}
            onReload={() => {
              fetchForums(industry?.industryId!);
            }}
          />
        ) : null}
        <div className="bg-white">
          {forums.map((forum: ForumProp, index: number) => (
            <ForumItem
              onEdit={() => {
                setStateProps(forum);
                setOpenModal(true);
              }}
              onComment={(comment: Comment) => {
                onComment(comment, index);
              }}
              onLike={(postId: string) => {
                onLike(
                  {
                    postId,
                    type: "forum",
                    userId: profile!.uid,
                    receiverUid: forum.user!.uid,
                  },
                  index
                );
              }}
              onCoin={(postId: string) => {
                onCoin(
                  {
                    postId,
                    type: "forum",
                    userId: profile!.uid,
                    receiverUid: forum.user!.uid,
                    timestamp: Date.now(),
                  },
                  index
                );
              }}
              key={forum.forumId}
              data={forum}
            />
          ))}
        </div>
      </div>
      <div className="computer-only">
        <ComputerHeader
          onTapButton={() => {
            setOpenModal(true);
          }}
        />
        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5 pl-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >
            {loading ? (
              <FetchStatus
                error={false}
                errorMessage="Something went wrong!!"
                loading={true}
                onReload={() => {}}
              />
            ) : null}
            {err ? (
              <FetchStatus
                error={true}
                errorMessage="Something went wrong!!"
                loading={false}
                onReload={() => {
                  fetchForums(industry?.industryId!);
                }}
              />
            ) : null}
            <div className="">
              {forums.map((forum: ForumProp, index: number) => (
                <ForumItem
                  onEdit={() => {
                    setStateProps(forum);
                    setOpenModal(true);
                  }}
                  onComment={(comment: Comment) => {
                    onComment(comment, index);
                  }}
                  onLike={(postId: string) => {
                    onLike(
                      {
                        postId,
                        type: "forum",
                        userId: profile!.uid,
                        receiverUid: forum.user!.uid,
                      },
                      index
                    );
                  }}
                  onCoin={(postId: string) => {
                    onCoin(
                      {
                        postId,
                        type: "forum",
                        userId: profile!.uid,
                        receiverUid: forum.user!.uid,
                        timestamp: Date.now(),
                      },
                      index
                    );
                  }}
                  key={forum.forumId}
                  data={forum}
                />
              ))}
            </div>
          </div>

          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection ml-5 mr-5 mb-40 lg:mr-20 pr-0 mt-5"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="flex items-center gap-2 pb-5">
              <button onClick={() => navigate(-1)}>
                <Assets.Backbutton />
              </button>
              <p className="text-base font-[700]">{industry?.industry}</p>
            </div>
            {industry ? (
              <div className="bg-[#F4F4F4] p-3 rounded-3xl">
                <ForumCard
                  onCreate={() => {
                    setOpenModal(true);
                  }}
                  createLabel={
                    industry.categoryId === AppConstants.LEARNINGID
                      ? "Start a topic"
                      : "Share Opportunities"
                  }
                  banner={industry?.photo!}
                  didJoin={!!industry.joinedUsers?.includes(profile!.uid)}
                  label={industry?.description ?? "Industry description"}
                  members={industry?.joinedUsers?.length ?? 0}
                  onJoin={joinIndustry}
                  topics={count}
                  aboutontap={openPopup}
                  aboutontaptext="Info"
                  topicsicon={<Assets.Topicsicon />}
                  topicstext={
                    industry.categoryId === AppConstants.LEARNINGID
                      ? "Topics"
                      : "Opport."
                  }
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
