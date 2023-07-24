import { Route, Routes } from "react-router-dom";
import RoutesPath from "./constants/Routes";
import HomePage from "./pages/home/views/HomePage";
import MarketPlacePage from "./pages/marketplace/views/MarketPlacePage";
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
import { saveBossupData, saveUserData } from "./redux/slices/UserSlice";
import HomeController from "./pages/home/controller/HomeController";
import { saveChatsToState } from "./redux/slices/ChatSlice";
import CommunitiesPage from "./pages/communities/views/CommunitiesPage";
import { useSocket } from "./hooks/useSockets";
import { socketUrl } from "./config/config";
import CreateBossup from "./pages/communities/views/CreateBossup";
const App = () => {
  const [err, setErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  let socket = useSocket(socketUrl, {
    reconnectionDelay: 10000,
    transports: ["websocket"],
    autoConnect: false,
  });
  const fetchBossOfTheWeek = async () => {
    const response = await serviceApi.fetch("/users/bossup");
    if (response.success) {
      dispatch(
        saveBossupData({
          ...response.data,
          connecteds: response.data.connecteds.map((mp: any) => mp.userId),
          connections: response.data.connections.map((mp: any) => mp.connect),
        })
      );
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setErr(false);
    const response = await serviceApi.fetch("/init");
    fetchBossOfTheWeek();
    if (response.success) {
      const processedPosts = HomeController.processData(response);
      socket.emit("handshake", response.data.user.uid);
      dispatch(
        saveUserData({
          ...response.data.user,
          connecteds: response.data.connecteds,
          connections: response.data.user.connections.map(
            (mp: any) => mp.connect
          ),
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

  const StartListeners = () => {
    /** Connection / reconnection listeners */
    socket.io.on("reconnect", (attempt) => {
      // console.info("Reconnected on attempt: " + attempt);
      SendHandshake();
    });

    socket.on("handshake", (data) => {
      // console.log(data);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      // console.info("Reconnection Attempt: " + attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      // console.info("Reconnection error: " + error);
    });

    socket.io.on("reconnect_failed", () => {
      // console.info("Reconnection failure.");
    });
  };

  const SendHandshake = async () => {
    // console.info("Sending handshake to server ...");
  };

  useEffect(() => {
    socket.connect();
    StartListeners();
    SendHandshake();
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
      <Route path={RoutesPath.home} element={<HomePage socket={socket} />} />
      <Route
        path={RoutesPath.marketPlace}
        element={<MarketPlacePage socket={socket} />}
      />
      <Route path={RoutesPath.myProfile} element={<MyProfile />} />
      <Route
        path={RoutesPath.communities}
        element={<CommunitiesPage socket={socket} />}
      />
      <Route path={RoutesPath.forum} element={<Forum socket={socket} />} />
      <Route path={RoutesPath.CreateBossup} element={<CreateBossup />} />
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
      <Route
        path={RoutesPath.ChatRoom}
        element={<ChatRoomPage socket={socket} />}
      />
      <Route path={RoutesPath.CreateListing} element={<CreateListing />} />
      <Route
        path={RoutesPath.PublicUserProfile}
        element={<PublicUserProfile />}
      />
    </Routes>
  );
};

export default App;
