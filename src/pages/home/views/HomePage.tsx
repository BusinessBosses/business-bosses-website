import ForumItem from "../../../common/components/forum/ForumItem";
import { Forum } from "../../../common/interfaces/forum";
import { Post } from "../../../common/interfaces/post";
import { MixedPostState } from "../../../redux/slices/PostSlice";
import { useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "./components/MobileBossOfTheWeek";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileHeader from "./components/MobileHeader";
import PostItem from "./components/PostItem";
const HomePage = () => {
  const posts = useAppSelector((state) => state.post.mixedPosts);
  const profile = useAppSelector((state) => state.user.profile);
  const chats = useAppSelector((state) => state.chat.chats);
  return (
    <div className=" ">
      <MobileHeader
        coins={profile?.coinscount}
        unseenNotification={profile?.unReadCount! > 0}
        unseenChat={
          !!chats.find((fd) => fd.senderUid !== profile?.uid && !fd.seen)
        }
      />
      <div className="mt-20">
        <MobileBossOfTheWeek />
      </div>
      <div className="p-5">
        {posts.map((post: MixedPostState, index: number) => {
          if (post.isForum) {
            return <ForumItem data={post.data as Forum} key={index} />;
          } else {
            return <PostItem data={post.data as Post} key={index} />;
          }
        })}
      </div>
      <div className="my-20"></div>
      <MobileBottomNav currentIndex={0} />
    </div>
  );
};

export default HomePage;
