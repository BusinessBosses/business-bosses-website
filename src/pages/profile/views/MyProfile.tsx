import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import MyProfileHeader from "./components/MyProfileHeader";
import MyProfileDetails from "./components/MyProfileDetails";
import Tabs from "./components/Tabs";
import { useEffect, useState } from "react";
import About from "./components/About";
import Posts from "./components/Posts";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import ProfileController from "../controller/ProfileController";
import { savePostsToState } from "../../../redux/slices/UserSlice";
import { Post } from "../../../common/interfaces/post";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
const MyProfile = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const profile = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const fetchPosts = async (userId: string) => {
    setLoading(true);
    setErr(false);
    const response = await ProfileController.fetchUserPosts(userId);
    if (response.success) {
      dispatch(
        savePostsToState(
          response.data.posts.rows.map((mp: Post) => ({
            ...mp,
            coins: mp.coins.map((cn: any) => cn.userId),
            likes: mp.likes.map((lk: any) => lk.userId),
          }))
        )
      );
    } else {
      setErr(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!!!profile.posts.length) {
      fetchPosts(profile.profile?.uid!);
    }
  }, [profile.profile?.uid]);
  return (
    <div>
      <MyProfileHeader />
      <MyProfileDetails data={profile.profile!} />

      <div className="mt-3">
        <Tabs
          currentIndex={currentTabIndex}
          onChangeRoute={(index: number) => setCurrentTabIndex(index)}
        />

        {currentTabIndex === 0 ? <About data={profile.profile!} /> : null}
        {currentTabIndex === 1 ? (
          loading ? (
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
                fetchPosts(profile.profile?.uid!);
              }}
            />
          ) : (
            <Posts posts={profile.posts} />
          )
        ) : null}
      </div>
      <div className="my-20"></div>
      <MobileBottomNav currentIndex={3} />
    </div>
  );
};

export default MyProfile;
