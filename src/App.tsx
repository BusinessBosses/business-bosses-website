import { Route, Routes } from "react-router-dom";
import RoutesPath from "./constants/Routes";
import HomePage from "./pages/home/views/HomePage";
import MarketPlacePage from "./pages/marketplace/views/MarketPlacePage";
import BossupPage from "./pages/bossup/views/BossupPage";
import Forum from "./pages/forum/views/Forum";
import CreatePost from "./pages/CreatePost.tsx/views/CreatePost";
import PromotePage from "./pages/promote/views/PromotePage";
import MyProfile from "./pages/profile/views/MyProfile";
import SettingsPage from "./pages/settings/views/SettingsPage";
import InvitePage from "./pages/invite/views/InvitePage";
import NotificationPage from "./pages/notification/views/NotificationPage";
import HomeSearch from "./pages/search/views/HomeSearch";
import ConnectionsPage from "./pages/connections/views/ConnectionsPage";
import RegisterPage from "./pages/authentication/views/RegisterPage";
import LoginPage from "./pages/authentication/views/LoginPage";
import OtpVerificationPage from "./pages/authentication/views/OtpVerificationPage";
import PublicUserProfile from "./pages/profile/views/PublicUserProfile";
import EditProfilePage from "./pages/profile/views/EditProfilePage";
import ChatPage from "./pages/chat/views/ChatPage";
import ChatRoomPage from "./pages/chat/views/ChatRoomPage";
import CreateListing from "./pages/marketplace/views/CreateListing";
import { useEffect, useState } from "react";
import serviceApi from "./services/serviceApi";
import { useAppDispatch } from "./redux/store/store";
import { addPostToState } from "./redux/slices/PostSlice";
import FetchStatus from "./common/components/fetch_status/FetchStatus";
import { saveUserData } from "./redux/slices/UserSlice";
import HomeController from "./pages/home/controller/HomeController";
import { saveChatsToState } from "./redux/slices/ChatSlice";
const App = () => {
  const [err, setErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    setLoading(true);
    setErr(false);
    const response = await serviceApi.fetch("/init");
    if (response.success) {
      const processedPosts = HomeController.processData(response);
      dispatch(
        saveUserData({
          ...response.data.user,
          connecteds: response.data.connecteds,
          interests: response.data.interests,
        })
      );
      dispatch(saveChatsToState(response.data.chats));
      dispatch(addPostToState(processedPosts));
    } else {
      setErr(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return loading ? (
    <FetchStatus
      error={err}
      errorMessage="Something went wrong!!"
      loading={true}
      onReload={fetchData}
    />
  ) : err ? (
    <FetchStatus
      error={true}
      errorMessage="Something went wrong!!"
      loading={false}
      onReload={fetchData}
    />
  ) : (
    <Routes>
      <Route path={RoutesPath.home} element={<HomePage />} />
      <Route path={RoutesPath.marketPlace} element={<MarketPlacePage />} />
      <Route path={RoutesPath.myProfile} element={<MyProfile />} />
      <Route path={RoutesPath.bossup} element={<BossupPage />} />
      <Route path={RoutesPath.forum} element={<Forum />} />
      <Route path={RoutesPath.createPost} element={<CreatePost />} />
      <Route path={RoutesPath.promotePost} element={<PromotePage />} />
      <Route path={RoutesPath.settings} element={<SettingsPage />} />
      <Route path={RoutesPath.invite} element={<InvitePage />} />
      <Route path={RoutesPath.notifications} element={<NotificationPage />} />
      <Route path={RoutesPath.homeSearch} element={<HomeSearch />} />
      <Route path={RoutesPath.connections} element={<ConnectionsPage />} />
      <Route path={RoutesPath.register} element={<RegisterPage />} />
      <Route path={RoutesPath.login} element={<LoginPage />} />
      <Route path={RoutesPath.verifyOtp} element={<OtpVerificationPage />} />
      <Route path={RoutesPath.editProfile} element={<EditProfilePage />} />
      <Route path={RoutesPath.chats} element={<ChatPage />} />
      <Route path={RoutesPath.ChatRoom} element={<ChatRoomPage />} />
      <Route path={RoutesPath.CreateListing} element={<CreateListing />} />
      <Route
        path={RoutesPath.PublicUserProfile}
        element={<PublicUserProfile />}
      />
    </Routes>
  );
};

export default App;
