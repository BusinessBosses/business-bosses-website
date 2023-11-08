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
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "./components/ComputerProfiledetailswcr";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";
import Markets from "./components/Markets";
import { Market } from "../../../common/interfaces/Market";
import MarketController from "../../marketplace/controller/MarketController";
import { saveCount } from "../../../redux/slices/ForumSlice";
import { addMarketsToState } from "../../../redux/slices/MarketSlice";
import { incrementPage } from "../../../redux/slices/PostSlice";
import { savePostsToState } from "../../../redux/slices/UserSlice";
import MarketItem from "../../marketplace/views/components/MarketItem";

interface Props {
  partnerData: PartnerData | null;
partnerDatatile: PartnerDatatile | null;
}

const PublicUserProfile: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const market = useAppSelector((state) => state.market);
  const [publicUser, setPublicUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user);
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
    const state = location.state;
    if (!!!state) {
      navigate(-1);
    } else {
      const publicUserState: User = state;
      setPublicUser(publicUserState);
      fetchPosts(publicUserState.uid);
      // fetchMarkets(publicUserState.uid);

    }
  }, []);
  return (
    <div>
      <div className="mobile-only bg-white" style={{height:"100vh"}}>
        <PublicProfileHeader name={publicUser?.username ?? ""} />

        {loading ? (
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
              fetchPosts(publicUser?.uid!);
            }}
          />
        ) : (
          <div>
            {publicUser ? <PublicProfileDetails data={publicUser!} /> : null}

            <div className="mt-3">
              <Tabs
                    currentIndex={currentTabIndex}
                    onChangeRoute={(index: number) => setCurrentTabIndex(index)} uid={publicUser?.uid.toString}              />

              {currentTabIndex === 0 && publicUser ? (
                <About data={publicUser!} />
              ) : null}
              {currentTabIndex === 1 ? <Posts posts={posts} /> : null}
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
                    .filter((market) => market.userId === publicUser?.uid)
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
          </div>
        )}
      </div>

      <div className="computer-only">
        <ComputerHeader partnerData={partnerData}   partnerDatatile={partnerDatatile}  />

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
            <PublicProfileHeader name={publicUser?.username ?? ""} />

            {loading ? (
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
                  fetchPosts(publicUser?.uid!);
                }}
              />
            ) : (
              <div>
                {publicUser ? <PublicProfileDetails data={publicUser!} /> : null}

                <div className="mt-3">
                  <Tabs
                        currentIndex={currentTabIndex}
                        onChangeRoute={(index: number) => setCurrentTabIndex(index)} uid={publicUser?.uid.toString}                  />

                  {currentTabIndex === 0 && publicUser ? (
                    <About data={publicUser!} />
                  ) : null}
                  {currentTabIndex === 1 ? <Posts posts={posts} /> : null}
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
                    .filter((market) => market.userId === publicUser?.uid)
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
              </div>
            )}
          </div>

          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,



          }}>

            <div className="rounded-xl overflow-hidden" style={{}}>
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} partnerData={partnerData}   partnerDatatile={partnerDatatile} />
              ) : null}
            </div>


          </div>


        </div>


      </div>
    </div>
  );
};

export default PublicUserProfile;
