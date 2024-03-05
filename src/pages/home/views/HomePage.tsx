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
import { Helmet } from "react-helmet";
import Loader from "../../../common/components/loader/Loader";


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
      const lastTimestamp = posts.length > 0 ? posts[posts.length - 1]?.data.timestamp : 0;
  
      const response = await serviceApi.fetch(`/post/get-posts?page=${page + 1}&size=${50}&lastTimestamp=${lastTimestamp}`);
  
      if (response && response.data && response.data.posts) {
        const processedPosts = HomeController.processnewData(response); 
  
        dispatch(addPostToState(processedPosts));
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error("Invalid response format:", response);
      }
  
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoading(false);
    }
  }



  // useEffect(() => {
  //   function handleScroll() {
  //     if (
  //       window.innerHeight + document.documentElement.scrollTop ===
  //         document.documentElement.offsetHeight
  //     ) {
  //       fetchMorePosts();
  //     }
  //   }

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [loading]); // Empty dependency array to run the effect only once on mount



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
      <Helmet>

        <title>Home - Business Bosses</title>
        <meta name="description" content="Social Entrepreneur Community - Grow and Promote your Business." />


        <meta itemProp="name" content="Business Bosses" />
        <meta itemProp="description" content="Social Entrepreneur Community - Grow and Promote your Business." />
        <meta itemProp="image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />


        <meta property="og:url" content="https://businessbosses.co.uk" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Business Bosses" />
        <meta property="og:description" content="Social Entrepreneur Community - Grow and Promote your Business." />
        <meta property="og:image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />


        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Bosses" />
        <meta name="twitter:description" content="Social Entrepreneur Community - Grow and Promote your Business." />
        <meta name="twitter:image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />

      </Helmet>




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

        {[...posts.map((post: MixedPostState, index: number) => {
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
        }), posts.length > 0 ? (
          <div className="text-center" style={{ textAlign: "center" }}>
            <div onClick={() => {
              fetchMorePosts();
            }} className="rounded-full py-3 px-5 my-5 bg-white shadow text-primary" key="additional-text" style={{ display: "inline-block", }}>
             {loading ? (
                         <svg
                         aria-hidden="true"
                         className={`inline ${
                         "w-4 h-4"
                         } text-primary animate-spin fill-white`}
                         viewBox="0 0 100 101"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path
                           d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                           fill="currentColor"
                         />
                         <path
                           d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                           fill="currentFill"
                         />
                       </svg>
                  ) : (
                    'See More Posts'
                  )}
            </div>

          </div>
        ) : null]}
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
            {[...posts.map((post: MixedPostState, index: number) => {
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
            }), posts.length > 0 ? (
              <div className="text-center" style={{ textAlign: "center" }}>
                <div onClick={() => {
                  fetchMorePosts();
                }} className="rounded-full py-3 px-5 my-5 bg-white shadow text-primary" key="additional-text" style={{ display: "inline-block", }}>
                  {loading ? (
                         <svg
                         aria-hidden="true"
                         className={`inline ${
                         "w-4 h-4"
                         } text-primary animate-spin fill-white`}
                         viewBox="0 0 100 101"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path
                           d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                           fill="currentColor"
                         />
                         <path
                           d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                           fill="currentFill"
                         />
                       </svg>
                  ) : (
                    'See More Posts'
                  )}
                </div>

              </div>
            ) : null]
            }
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
