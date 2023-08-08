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
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "./components/ComputerProfiledetails";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
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
      <div className="mobile-only bg-white" style={{height:"100vh"}}>
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
                onReload={() => { }}
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
              <div className="mt-4">
              <Posts posts={profile.posts} /></div>
            )
          ) : null}
        </div>
        <div className="my-20"></div>
        <MobileBottomNav currentIndex={3} />
      </div>


      <div className="computer-only">


        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection ml-5 lg:ml-20 pr-5 pl-0" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,

          }}>
            <div className="" >
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile.profile!} />
              </div>

            </div>
          </div>
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>


          <div className="computer-main-content" style={{ width: '40%', flexGrow: 0 }} >

          <div className="sticky" ><MyProfileHeader /></div>

            <MyProfileDetails data={profile.profile!} />

            <div className="py-5">
            <Tabs 
              currentIndex={currentTabIndex}
              onChangeRoute={(index: number) => setCurrentTabIndex(index)}
            />
            </div>

            {currentTabIndex === 0 ? <About data={profile.profile!} /> : null}
            {currentTabIndex === 1 ? (
              loading ? (
                <FetchStatus
                  error={false}
                  errorMessage="Something went wrong!!"
                  loading={true}
                  onReload={() => { }}
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
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>

          <div className="lastsection ml-5 mr-5 lg:mr-20 pr-0 mb-0" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,



          }}>

            <div className="rounded-xl overflow-hidden mt-5" style={{}}>
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
              ) : null}
            </div>


          </div>



        </div>

       
      </div>


    </div>
  );
};

export default MyProfile;
