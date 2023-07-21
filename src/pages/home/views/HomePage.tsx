import { Socket } from "socket.io-client";
import ForumItem from "../../../common/components/forum/ForumItem";
import GeneralPostsController, {
  CoinStruct,
  LikeStruct,
} from "../../../common/controllers/GeneralPostsController";
import { Forum } from "../../../common/interfaces/forum";
import { Post } from "../../../common/interfaces/post";
import { MixedPostState, updatePost } from "../../../redux/slices/PostSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "./components/MobileBossOfTheWeek";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileHeader from "./components/MobileHeader";
import PostItem from "./components/PostItem";
import { saveUserData } from "../../../redux/slices/UserSlice";
import { Comment } from "../../../common/interfaces/comment";
interface Props {
  socket: Socket;
}
const HomePage = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.mixedPosts);
  const profile = useAppSelector((state) => state.user);
  const chats = useAppSelector((state) => state.chat.chats);
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
  return (
    <div className=" ">
      <MobileHeader
        coins={profile?.profile!.coinscount}
        unseenNotification={profile?.profile!.unReadCount! > 0}
        unseenChat={
          !!chats.find(
            (fd) => fd.senderUid !== profile?.profile!.uid && !fd.seen
          )
        }
      />
      <div className="mt-20">
        {profile.bossup ? (
          <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
        ) : null}
      </div>
      <div className="p-5">
        {posts.map((post: MixedPostState, index: number) => {
          if (post.isForum) {
            return (
              <ForumItem
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
                data={post.data as Post}
                key={index}
              />
            );
          }
        })}
      </div>
      <div className="my-20"></div>
      <MobileBottomNav currentIndex={0} />
    </div>
  );
};

export default HomePage;
