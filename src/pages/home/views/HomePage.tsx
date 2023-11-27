import { Socket } from "socket.io-client";
import ForumItem from "../../../common/components/forum/ForumItem";
import GeneralPostsController, {
  CoinStruct,
  LikeStruct,
  ViewStruct,
} from "../../../common/controllers/GeneralPostsController";
import { Forum } from "../../../common/interfaces/forum";
import { Post } from "../../../common/interfaces/post";
import { MixedPostState, addPostToState, updatePost } from "../../../redux/slices/PostSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";

import MobileBottomNav from "./components/MobileBottomNav";
import MobileHeader from "./components/MobileHeader";
import PostItem from "./components/PostItem";
import { saveUserData } from "../../../redux/slices/UserSlice";
import { Comment } from "../../../common/interfaces/comment";
import ComputerHeader from "./components/ComputerHeader";
import MobileBossOfTheWeek from "./components/BossOfTheWeek";
import MyProfileDetails from "../../profile/views/components/MyProfileDetails";
import { User } from "../../../common/interfaces/user";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import { useEffect, useState } from "react";
import { Login } from "@mui/icons-material";
import FilledButtonsmall from "../../../common/components/buttons/FilledButtonsmall";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import Computerlefttabsignedoutuser from "../../profile/views/components/Computerlefttabsignedoutuser";
import Assets from "../../../assets";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";
import { log } from "console";
import serviceApi from "../../../services/serviceApi";
import HomeController from "../controller/HomeController";


interface Props {
  socket: Socket;
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
}
const HomePage = ({ socket, partnerData, partnerDatatile }: Props) => {

  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.mixedPosts);
  const profile = useAppSelector((state) => state.user);
  const chats = useAppSelector((state) => state.chat.chats);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMorePosts = async () => {
    try {
      setLoading(true);
      const response = await serviceApi.fetch(`/init?page=${page}`);
      console.log('Server Response:', response);
  
      const processedPosts = HomeController.processData(response);
      console.log('Processed Posts:', processedPosts);
  
      dispatch(addPostToState(processedPosts));
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  


  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        fetchMorePosts();
      }
    }
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]); // Empty dependency array to run the effect only once on mount



  const onLike = (args: LikeStruct, postIndex: number) => {
    let post = posts[postIndex];
    if (post.data.likes!.includes(profile.profile?.uid!)) {
      post = {
        ...post,
        data: {
          ...post.data,
          likes: post.data.likes!.filter((ft) => ft !== profile.profile!.uid),
        },
      };
    } else {
      post = {
        ...post,
        data: {
          ...post.data,
          likes: [...post.data.likes!, profile.profile!.uid],
        },
      };
    }
    dispatch(updatePost({ index: postIndex, post }));
    GeneralPostsController.like(args, socket);
  };

  const onCoin = (args: CoinStruct, postIndex: number) => {
    let post = posts[postIndex];
    if (post.data.coins!.includes(profile.profile?.uid!)) {
      post = {
        ...post,
        data: {
          ...post.data,
          coins: post.data.coins!.filter((ft) => ft !== profile.profile!.uid),
        },
      };
      dispatch(
        saveUserData({
          ...profile.profile!,
          coinscount: profile.profile!.coinscount! + 1,
        })
      );
    } else {
      post = {
        ...post,
        data: {
          ...post.data,
          coins: [...post.data.coins!, profile.profile!.uid],
        },
      };
      dispatch(
        saveUserData({
          ...profile.profile!,
          coinscount: profile.profile!.coinscount! - 1,
        })
      );
    }
    dispatch(updatePost({ index: postIndex, post }));
    GeneralPostsController.coin(args, socket);
  };

  const onComment = (comment: Comment, postIndex: number) => {
    let post = posts[postIndex];
    post = {
      ...post,
      data: {
        ...post.data,
        comments: [...post.data.comments!, comment],
      },
    };
    dispatch(updatePost({ index: postIndex, post }));
  };

  const onView = (args: ViewStruct, postIndex: number, isForum: boolean) => {
    // Get the post from the posts array
    let post = posts[postIndex];

    // Increment the view count
    post = {
      ...post,
      data: {
        ...post.data,
        views: post.data.views + 1,
      },
    };

    // Dispatch the updated post to Redux
    dispatch(updatePost({ index: postIndex, post }));
    if (isForum) {
      GeneralPostsController.addForumView(args);
    } else {
      GeneralPostsController.addView(args);
    }
  };



  


  return (
    <div>

      <div className="mobile-only bg-[#fff]">
        <div className="justify-center items-center flex ">
          <div style={{ position: 'relative' }}>

            <div className="p-4 flex justify-between items-center" style={{ position: 'relative', zIndex: 2 }}>
              <div className="mr-3">
                <div className="flex gap-2 items-center pb-2">
                  <div className="text-sm font-bold">Download App to do more</div>
                </div>
                <div className="text-xs">We have so much more to offer to ensure you have a truly boss experience</div>
              </div>
              {profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?

                <div className="flex" style={{ height: '100%' }}>
                  <button
                    onClick={() => navigate(RoutesPath.login)}
                    className={`bg-white rounded-xl text-primary text-xs shadow-lg flex items-center justify-center font-bold p-2 px-4`}
                    style={{ height: '100%', whiteSpace: 'nowrap' }}
                  >
                    Log in
                  </button>
                </div> : null}

            </div>
            <div className=" pb-3">
              <div className="mt-0" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ width: '35%', display: 'flex', justifyContent: 'center' }}>
                  <Assets.Appstorelogo
                    onClick={() =>
                      (window.location.href = "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")
                    }
                  />
                </div>
                <div style={{ width: '35%', display: 'flex', justifyContent: 'center' }}>
                  <Assets.Playstorelogo
                    onClick={() =>
                      (window.location.href = "https://play.google.com/store/search?q=Business%20bosses&c=apps")
                    }
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="" style={{ borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
        <MobileHeader
          coins={profile?.profile!.coinscount}
          unseenNotification={profile?.profile!.unReadCount! > 0}
          unseenChat={
            !!chats.find(
              (fd) => fd.senderUid !== profile?.profile!.uid && !fd.seen
            )
          }
        />



        <div className="">
          {profile.bossup ? (
            <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} partnerData={partnerData} partnerDatatile={partnerDatatile} />
          ) : null}
        </div>

        {posts.map((post: MixedPostState, index: number) => {
          if (post.isForum) {
            return (
              <ForumItem
                onEdit={() => { }}
                onComment={(comment: Comment) => {
                  onComment(comment, index);
                }}
                onLike={(postId: string) => {
                  onLike(
                    {
                      postId,
                      type: "forum",
                      userId: profile.profile!.uid,
                      receiverUid: post.data.user!.uid,
                    },
                    index
                  );
                }}
                onCoin={(postId: string) => {
                  onCoin(
                    {
                      postId,
                      type: "forum",
                      userId: profile.profile!.uid,
                      receiverUid: post.data.user!.uid,
                      timestamp: Date.now(),
                    },
                    index
                  );
                }}
                onView={(postId: string) => onView({ postId: postId, views: post.data.views + 1 }, index, true)}
                data={post.data as Forum}
                key={index}
              />
            );
          } else {
            return (
              <PostItem
                onComment={(comment: Comment) => {
                  onComment(comment, index);
                }}
                onLike={(postId: string) => {
                  onLike(
                    {
                      postId,
                      type: "post",
                      userId: profile.profile!.uid,
                      receiverUid: post.data.user!.uid,
                    },
                    index
                  );
                }}
                onCoin={(postId: string) => {
                  onCoin(
                    {
                      postId,
                      type: "post",
                      userId: profile.profile!.uid,
                      receiverUid: post.data.user!.uid,
                      timestamp: Date.now(),
                    },
                    index
                  );
                }}
                onView={(postId: string) => onView({ postId: postId, views: post.data.views + 1 }, index, false)}
                data={post.data as Post}
                key={index}
              />
            );
          }
        })}
        <div className="mb-20"></div>
        <MobileBottomNav currentIndex={0} />
      </div>


      <div className="computer-only bg-[#fff]">
        <ComputerHeader partnerData={partnerData} partnerDatatile={partnerDatatile} />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                {profile.profile?.email != `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                  <ComputerProfileDetails data={profile.profile!} /> : <Computerlefttabsignedoutuser data={profile.profile!} />}
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "50%", flexGrow: 0 }}
          >
            {posts.map((post: MixedPostState, index: number) => {
              if (post.isForum) {
                return (
                  <ForumItem
                    onEdit={() => { }}
                    onComment={(comment: Comment) => {
                      onComment(comment, index);
                    }}
                    onLike={(postId: string) => {
                      onLike(
                        {
                          postId,
                          type: "forum",
                          userId: profile.profile!.uid,
                          receiverUid: post.data.user!.uid,
                        },
                        index
                      );
                    }}
                    onCoin={(postId: string) => {
                      onCoin(
                        {
                          postId,
                          type: "forum",
                          userId: profile.profile!.uid,
                          receiverUid: post.data.user!.uid,
                          timestamp: Date.now(),
                        },
                        index
                      );
                    }}
                    onView={(postId: string) => onView({ postId: postId, views: post.data.views + 1 }, index, true)}
                    data={post.data as Forum}
                    key={index}
                  />
                );
              } else {
                return (
                  <PostItem
                    onComment={(comment: Comment) => {
                      onComment(comment, index);
                    }}
                    onLike={(postId: string) => {
                      onLike(
                        {
                          postId,
                          type: "post",
                          userId: profile.profile!.uid,
                          receiverUid: post.data.user!.uid,
                        },
                        index
                      );
                    }}
                    onCoin={(postId: string) => {
                      onCoin(
                        {
                          postId,
                          type: "post",
                          userId: profile.profile!.uid,
                          receiverUid: post.data.user!.uid,
                          timestamp: Date.now(),
                        },
                        index
                      );
                    }}
                    onView={(postId: string) => onView({ postId: postId, views: post.data.views + 1 }, index, false)}
                    data={post.data as Post}
                    key={index}
                  />
                );
              }
            })}
          </div>
          <div
            style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}
          ></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} partnerData={partnerData} partnerDatatile={partnerDatatile} />
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
