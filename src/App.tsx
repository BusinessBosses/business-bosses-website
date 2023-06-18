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
    </Routes>
  );
};

export default App;
