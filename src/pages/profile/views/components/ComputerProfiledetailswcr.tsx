import Assets from "../../../../assets";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import SubscribeButton from "../../../settings/components/Subscribebutton";
import ConnectRelevant from "../../../settings/views/ConnectRelevant";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { StorageEnum } from "../../../../common/emums/StorageEmuns";
import AuthController from "../../../authentication/controller/AuthController";
import MyProfileDetails from "./MyProfileDetails";
import Posts from "./Posts";
import ProfileController from "../../controller/ProfileController";
import FetchStatus from "../../../../common/components/fetch_status/FetchStatus";
import About from "./About";
import { savePostsToState } from "../../../../redux/slices/UserSlice";
import Tabs from "./Tabs";
import { Post } from "../../../../common/interfaces/post";
import MyProfileHeader from "./MyProfileHeader";
import MarketItem from "../../../marketplace/views/components/MarketItem";

interface Props {
  data: User;
}

const ComputerProfileDetails = ({ data }: Props) => {
  const navigate = useNavigate();
  const market = useAppSelector((state) => state.market);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const profile = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
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



  // Function to handle the click event
  const handleProfileClick = () => {
    // Example: Navigate to a specific route when the profile is clicked
    navigate(RoutesPath.myProfile, { state: { userId: data.uid } });
  };
  const [loading, setLoading] = useState<boolean>(false);
  const login = async () => {
    if (loading) return;
    const validate = AuthController.validateLogin({
      email: `${process.env.REACT_APP_DUMMY_EMAIL}`,
      password: `${process.env.REACT_APP_DUMMY_PASSWORD}`,
      terms: true,
    });
    if (validate) {
      setLoading(true);
      const response = await AuthController.loginRequest({
        email: `${process.env.REACT_APP_DUMMY_EMAIL}`,
        password: `${process.env.REACT_APP_DUMMY_PASSWORD}`,
      });
      if (response.success) {
        localStorage.setItem(
          StorageEnum.AccessToken,
          response.data.accessToken
        );
        localStorage.setItem(StorageEnum.UserId, response.data.uid);
        toast.success("You have been signed out");

        // Reload the page to navigate to the home
        window.location.reload();
      } else {
        toast.error("Oops, try again! An Error Occurred");
      }

      setLoading(false);
    }
  };


  return (
    <div className=" " style={{ cursor: "pointer", height: "100vh", width: "100vh" }}>

      <div className="mt-0 ">
        <div>
          <div className="pb-2"></div>
          <MyProfileHeader />
          <MyProfileDetails data={profile.profile!} />
          <div className="mt-3">
            <Tabs
              currentIndex={currentTabIndex}
              onChangeRoute={(index: number) => setCurrentTabIndex(index)} uid={profile.profile?.uid} />

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

              <div>
                {market.markets
                  .filter((market) => market.userId === profile.profile?.uid)
                  .map((market, index) => (
                    <MarketItem
                      data={market}
                      onLike={() => { }}
                      onCoin={() => { }}
                      onComment={() => { }}
                      key={market.marketId}
                    />
                  ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComputerProfileDetails;
