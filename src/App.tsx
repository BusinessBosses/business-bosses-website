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
const App = () => {
  return (
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
    </Routes>
  );
};

export default App;
