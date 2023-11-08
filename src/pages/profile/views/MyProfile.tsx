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
import ComputerProfileDetails from "./components/ComputerProfiledetailswcr";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";
import MarketController from "../../marketplace/controller/MarketController";
import { addMarketsToState, addMembersToState, incrementPage, saveCount } from "../../../redux/slices/MarketSlice";
import MarketItem from "../../marketplace/views/components/MarketItem";
import { Market } from "../../../common/interfaces/Market";

interface Props {
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
}
const MyProfile: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const profile = useAppSelector((state) => state.user);
  const market = useAppSelector((state) => state.market);
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

  const fetchData = async (userId: string) => {
    // Fetch user posts
    setLoading(true);
    setErr(false);

    const responsePosts = await ProfileController.fetchUserPosts(userId);
    if (responsePosts.success) {
      dispatch(
        savePostsToState(
          responsePosts.data.posts.rows.map((mp: Post) => ({
            ...mp,
            coins: mp.coins.map((cn: any) => cn.userId),
            likes: mp.likes.map((lk: any) => lk.userId),
          }))
        )
      );
    } else {
      setErr(true);
    }

    // Fetch user markets
    const responseMarkets = await MarketController.fetchMarkets(market.page);
    if (responseMarkets.success) {
      dispatch(incrementPage());
      const filteredMarkets = responseMarkets.data.rows
        .map((mp: Market) => ({
          ...mp,
          coins: mp.coins!.map((cn: any) => cn.userId),
          likes: mp.likes!.map((lk: any) => lk.userId),
        }))
        .filter((market: { userId: string | undefined; }) => market.userId === profile.profile?.uid);

      dispatch(addMarketsToState(filteredMarkets));
      dispatch(saveCount(responseMarkets.data.count));
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
      <div className="mobile-only bg-white w-full" style={{ height: "100vh" }}>
        <MyProfileHeader />
        <div className="mx-5"><MyProfileDetails data={profile.profile!} /></div>


        <div className="mt-3">
          <Tabs
            currentIndex={currentTabIndex}
            onChangeRoute={(index: number) => setCurrentTabIndex(index)} uid={profile.profile?.uid.toString}          />

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
              <div className="">
                <Posts posts={profile.posts} /></div>
            )
          ) : null}
         {currentTabIndex === 2 ? (
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
                    // fetchMarketUsers();
                  }}
                />
              ) : (
                <div>
                  {market.markets
                    .filter((market) => market.userId === profile.profile?.uid)
                    .map((market, index) => (
                      <MarketItem
                        data={market}
                        onLike={() => {}}
                        onCoin={() => {}}
                        onComment={() => {}}
                        key={market.marketId}
                      />
                    ))}
                </div>
              )
            ) : null}

        </div>
        <div className="my-20"></div>
        <MobileBottomNav currentIndex={3} />
      </div>


      <div className='computer-only'>
        <ComputerHeader partnerData={partnerData} partnerDatatile={partnerDatatile} />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
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
                {/* <ComputerProfileDetails data={profile.profile!} /> */}
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >
            <div className="sticky" ><MyProfileHeader /></div>

            <MyProfileDetails data={profile.profile!} />

            <div>
              <Tabs
                currentIndex={currentTabIndex}
                onChangeRoute={(index: number) => setCurrentTabIndex(index)} uid={profile.profile?.uid.toString}              />
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
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "30%",
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


export default MyProfile;