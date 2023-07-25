import Tabs from "./components/Tabs";
import { useEffect, useState } from "react";
import Posts from "./components/Posts";
import PublicProfileHeader from "./components/PublicProfileHeader";
import PublicProfileDetails from "./components/PublicProfileDetails";
import { Post } from "../../../common/interfaces/post";
import ProfileController from "../controller/ProfileController";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../../../common/interfaces/user";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import About from "./components/About";
const PublicUserProfile = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [publicUser, setPublicUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchPosts = async (userId: string) => {
    setLoading(true);
    setErr(false);
    const response = await ProfileController.fetchUserPosts(userId);
    if (response.success) {
      setPosts(
        response.data.posts.rows.map((mp: Post) => ({
          ...mp,
          coins: mp.coins.map((cn: any) => cn.userId),
          likes: mp.likes.map((lk: any) => lk.userId),
        }))
      );
      setPublicUser(response.data.user.data);
    } else {
      setErr(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const state = location.state;
    if (!!!state) {
      navigate(-1);
    } else {
      const publicUserState: User = state;
      setPublicUser(publicUserState);
      fetchPosts(publicUserState.uid);
    }
  }, []);
  return (
    <div>
      <PublicProfileHeader name={publicUser?.username ?? ""} />

      {loading ? (
        <FetchStatus
          error={false}
          errorMessage="Something went wrong!!"
          loading={true}
          onReload={() => {}}
        />
      ) : err ? (
        <FetchStatus
          error={true}
          errorMessage="Something went wrong!!"
          loading={false}
          onReload={() => {
            fetchPosts(publicUser?.uid!);
          }}
        />
      ) : (
        <div>
          {publicUser ? <PublicProfileDetails data={publicUser!} /> : null}

          <div className="mt-3">
            <Tabs
              currentIndex={currentTabIndex}
              onChangeRoute={(index: number) => setCurrentTabIndex(index)}
            />

            {currentTabIndex === 0 && publicUser ? (
              <About data={publicUser!} />
            ) : null}
            {currentTabIndex === 1 ? <Posts posts={posts} /> : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicUserProfile;
