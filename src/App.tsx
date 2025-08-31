import axios from "axios";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import FetchStatus from "./common/components/fetch_status/FetchStatus";
import { StorageEnum } from "./common/emums/StorageEmuns";
import { Market } from "./common/interfaces/Market";
import { PartnerData } from "./common/interfaces/partnerdata";
import { PartnerDatatile } from "./common/interfaces/partnerdatatile";
import { socketUrl } from "./config/config";
import RoutesPath from "./constants/Routes";
import { useSocket } from "./hooks/useSockets";
import AnalysePage from "./pages/analyse/views/AnalysePage";
import AnalyseProfilePage from "./pages/analyse/views/AnalyseProfilePage";
import ExploreBusinessBosses from "./pages/analyse/views/ExploreBusinessBosses";
import RankingPage from "./pages/analyse/views/RankingPage";
import AuthController from "./pages/authentication/controller/AuthController";
import RequestOtpForForgotPassword from "./pages/authentication/RequestOtpForForgotPassword";
import LoginPage from "./pages/authentication/views/LoginPage";
import OtpVerificationPage from "./pages/authentication/views/OtpVerificationPage";
import RegisterPage from "./pages/authentication/views/RegisterPage";
import Bossuppartnerpage from "./pages/bossuppartnerpage/bossuppartnerpage";
import ComputerBossuppartnersection from "./pages/bossuppartnerpage/computerbossupsection";
import ChatPage from "./pages/chat/views/ChatPage";
import ChatRoomPage from "./pages/chat/views/ChatRoomPage";
import Bossupsearch from "./pages/communities/views/Bossupsearch";
import CommunitiesPage from "./pages/communities/views/CommunitiesPage";
import CreateBossup from "./pages/communities/views/CreateBossup";
import ConnectionsPage from "./pages/connections/views/ConnectionsPage";
import BoostPost from "./pages/CreatePost/views/BoostPost";
import CreatePost from "./pages/CreatePost/views/CreatePost";
import ExpandedImages from "./pages/expandedimages/expandedimages";
import Forum from "./pages/forum/views/Forum";
import HomeController from "./pages/home/controller/HomeController";
import HomePage from "./pages/home/views/HomePage";
import InvitePage from "./pages/invite/views/InvitePage";
import BecomeAPartnerPage from "./pages/landingpage/BecomeAPartnerPage";
import BusinessToolsPage from "./pages/landingpage/BusinessToolsPage";
import LandingPage from "./pages/landingpage/LandingPage";
import LandingPageforPartners from "./pages/landingpage/LandingPageforPartners";
import Liveevent from "./pages/liveevent/liveevent";
import MarketController from "./pages/marketplace/controller/MarketController";
import CreateListing from "./pages/marketplace/views/CreateListing";
import CreateListingSelectorpage from "./pages/marketplace/views/CreateListingSelectorpage";
import MarketPlacePage from "./pages/marketplace/views/MarketPlacePage";
import NotificationPage from "./pages/notification/views/NotificationPage";
import EditProfilePage from "./pages/profile/views/EditProfilePage";
import MyProfile from "./pages/profile/views/MyProfile";
import PublicUserProfile from "./pages/profile/views/PublicUserProfile";
import PromotePage from "./pages/promote/views/PromotePage";
import ShopController from "./pages/proscreens/biz-center/controllers/ShopController";
import Expandedshop from "./pages/proscreens/biz-center/views/expandedshop";
import MyShop from "./pages/proscreens/biz-center/views/myShop";
import Layout from "./pages/proscreens/biz-center/views/prolayout";
import ShopView from "./pages/proscreens/biz-center/views/shop";
import Customers from "./pages/proscreens/customers/views/customers";
import Dashboard from "./pages/proscreens/dashboard/dashboard";
import Orders from "./pages/proscreens/orders/orders";
import Setup from "./pages/proscreens/setup/setup";
import SetupShop from "./pages/proscreens/setup/views/setupshop";
import Tasks from "./pages/proscreens/tasks/tasks";
import ReferPage from "./pages/refer/views/ReferPage";
import HomeSearch from "./pages/search/views/HomeSearch";
import SellerReview from "./pages/sellerreviews/SellerReview";
import CommunityRules from "./pages/settings/views/CommunityRules";
import ConnectRelevant from "./pages/settings/views/ConnectRelevant";
import ConnectRelevantPage from "./pages/settings/views/ConnectRelevantPage";
import Invitetandcs from "./pages/settings/views/Invitetandcs";
import SettingsPage from "./pages/settings/views/SettingsPage";
import BoostPostConfirmationPage from "./pages/subscription/views/BoostpostConfirmationPage";
import RenewSubscriptionConfirmationPage from "./pages/subscription/views/RenewSubscriptionConfirmationPage";
import ReviewPaymentPage from "./pages/subscription/views/ReviewPaymentPage";
import SubscriptionConfirmationPage from "./pages/subscription/views/SubscriptionConfirmationPage";
import SubscriptionFailedPage from "./pages/subscription/views/Subscriptionfailedpage";
import SubscriptionPage from "./pages/subscription/views/SubscriptionPage";
import { saveChatsToState } from "./redux/slices/ChatSlice";
import {
  addMarketsToState,
  addMembersToState,
  incrementPage,
  saveCount,
} from "./redux/slices/MarketSlice";
import { addPostToState } from "./redux/slices/PostSlice";
import { setShopInfo } from "./redux/slices/ShopSlice";
import { saveBossupData, saveUserData } from "./redux/slices/UserSlice";
import { useAppDispatch, useAppSelector } from "./redux/store/store";
import ProtectedRoute from "./services/ProtectedRoute";
import serviceApi from "./services/serviceApi";
import PrivacyPolicy from "./pages/privacypolicy/privacypolicy";

const App = () => {
  const [err, setErr] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const market = useAppSelector((state: { market: any }) => state.market);
  const user = useAppSelector((state) => state.user);
  const shop = useAppSelector((state) => state.shop.shopInfo);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [partnerDatatile, setPartnerDatatile] =
    useState<PartnerDatatile | null>(null);

  const [showAccessTokenDialog, setShowAccessTokenDialog] =
    useState<boolean>(false);
  const closePopup = () => {
    setIsPopupOpen(false);
  };
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
      if (response.data.username) {
        dispatch(
          saveBossupData({
            ...response.data,
            connecteds:
              response?.data.connecteds?.map((mp: any) => mp.userId) ?? [],
            connections:
              response?.data.connections?.map((mp: any) => mp.connect) ?? [],
          })
        );
      }
    }
  };

  const fetchMarkets = async () => {
    const response = await serviceApi.fetch(
      `/markets/all?size=20&page=${market.page}`
    );
    if (response.success) {
      dispatch(incrementPage());
      dispatch(
        addMarketsToState(
          response.data.rows.map((mp: Market) => ({
            ...mp,
            coins: mp.coins!.map((cn: any) => cn.userId),
            likes: mp.likes!.map((lk: any) => lk.userId),
          }))
        )
      );
      dispatch(saveCount(response.data.count));
    } else {
      setErr(true);
    }
  };

  const fetchPartnerData = async () => {
    try {
      const response = await axios.get(
        "https://orca-app-5dg8w.ondigitalocean.app/api/v1/partner/all"
      );

      if (response.status === 200) {
        const partnerData = response.data.data; // Access the "data" property

        if (partnerData && partnerData.rows) {
          // Check if "rows" exists and is an array
          const partners = partnerData.rows;

          // Find the partner with id 5
          const getTitle = partners.find(
            (item: { id: number }) => item.id === 12
          );

          if (getTitle) {
            setPartnerData({
              partnerlogo: getTitle.companyPhoto,
              adtitle: getTitle.companyName,
              addescription: getTitle.companyDescription,
              partnerurl: getTitle.companyUrl,
            });
          }
        }
      } else {
        console.error("Failed to fetch partner data.");
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
    }
  };

  const fetchMarketUsers = async () => {
    const response = await MarketController.fetchMarketUsers();
    if (response.success) {
      dispatch(addMembersToState(response.data.rows.map((mp: any) => mp.user)));
    }
  };

  const fetchUserShop = async (userId: string) => {
    const response = await ShopController.fetchUserShop(userId);
    console.log(response);
    if (
      response.success &&
      response.data.rows &&
      response.data.rows.length > 0
    ) {
      dispatch(setShopInfo(response.data.rows[0]));
    }
  };

  const fetchPartnerDatatile = async () => {
    try {
      const response = await axios.get(
        "https://orca-app-5dg8w.ondigitalocean.app/api/v1/partner/all"
      );

      if (response.status === 200) {
        const partnerData = response.data.data; // Access the "data" property

        if (partnerData && partnerData.rows) {
          // Check if "rows" exists and is an array
          const partners = partnerData.rows;

          // Find the partner with id 5
          const getTitle = partners.find(
            (item: { id: number }) => item.id === 5
          );
          const getTitlee = partners.find(
            (item: { id: number }) => item.id === 12
          );

          if (getTitle) {
            setPartnerDatatile({
              partnerlogo: getTitle.companyPhoto,
              adtitle: getTitle.companyName,
              addescription: getTitlee.companyName,
              partnerurl: getTitle.companyUrl,
            });
          }
        }
      } else {
        console.error("Failed to fetch partner data.");
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setErr(false);
    const response = await serviceApi.fetch("/init");
    fetchBossOfTheWeek();
    fetchMarkets();
    fetchMarketUsers();
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
      fetchUserShop(response.data.user.uid);
      dispatch(saveChatsToState(response.data.chats));
      dispatch(addPostToState(processedPosts));
    } else {
      setIsPopupOpen(true);
      setErrorMessage(response.message);
      setErr(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      localStorage.getItem(StorageEnum.UserId) &&
      localStorage.getItem(StorageEnum.AccessToken)
    ) {
      fetchData();
      fetchPartnerData();
      fetchPartnerDatatile();
      socket.connect();
      StartListeners();
      SendHandshake();
    } else {
      setLoading(false);
    }
  }, []);

  // Runs on route changes
  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  const StartListeners = () => {
    /** Connection / reconnection listeners */
    socket.io.on("reconnect", (attempt) => {
      SendHandshake();
    });

    socket.on("handshake", (data) => {});

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

  const login = () => {
    try {
      AuthController.loginRequest({
        email: process.env.REACT_APP_DUMMY_EMAIL,
        password: process.env.REACT_APP_DUMMY_PASSWORD,
      })
        .then((response) => {
          if (response.success) {
            window.location.reload();
            localStorage.setItem(
              StorageEnum.AccessToken,
              response.data.accessToken
            );
            localStorage.setItem(StorageEnum.UserId, response.data.uid);
            socket.connect();
            StartListeners();
            SendHandshake();
            navigate(RoutesPath.home);
          } else {
            toast.error("Oops, try again! An Error Occurred");
          }
        })
        .catch((error) => {
          // Handle any errors that occur during login here
          console.error("An error occurred during login:", error);
          toast.error(
            "Oops, an error occurred during login. Please try again."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors that occur synchronously here
      console.error("An error occurred during login:", error);
      toast.error("Oops, an error occurred during login. Please try again.");
      setLoading(false);
    }
  };

  ReactGA.initialize("G-HR9JXVYLJ9");

  return loading ? (
    <FetchStatus
      error={err}
      errorMessage="Something went wrong!!"
      loading={true}
      onReload={fetchData}
    />
  ) : err ? (
    errorMessage.toLowerCase() === "send a valid token" ||
    errorMessage.toLowerCase() === "invalid token" ? (
      <Popup
        closeOnDocumentClick={false}
        closeOnEscape={false}
        overlayStyle={{
          backdropFilter: "blur(5px)",
          background: "rgba(0,0,0,.5)",
        }}
        modal
        open={isPopupOpen}
      >
        <div className="flex justify-center px-3">
          <div className=" bg-white p-5 rounded-lg xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-full xs:w-full ">
            <div className="">
              <h1 className="text-2xl mb-5">Your AccessToken has Expired</h1>
              <small className="text-sm text-black-80">
                Your access token has expired. therefore, you will be required
                to login again to generate a new one.
              </small>
              {/* <br /> */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    localStorage.clear();
                    setIsPopupOpen(false);
                    navigate(RoutesPath.login);
                  }}
                  className="text-primary outline-none border-none font-semibold"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    ) : (
      <FetchStatus
        error={true}
        errorMessage="Something went wrong!!"
        loading={false}
        onReload={fetchData}
      />
    )
  ) : (
    <>
      <Helmet>
        <title>Business Bosses</title>
        <meta
          name="description"
          content="Social Entrepreneur Community - Grow and Promote your Business."
        />

        <meta itemProp="name" content="Business Bosses" />
        <meta
          itemProp="description"
          content="Social Entrepreneur Community - Grow and Promote your Business."
        />
        <meta
          itemProp="image"
          content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png"
        />

        <meta property="og:url" content="https://businessbosses.co.uk" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Business Bosses" />
        <meta
          property="og:description"
          content="Social Entrepreneur Community - Grow and Promote your Business."
        />
        <meta
          property="og:image"
          content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Bosses" />
        <meta
          name="twitter:description"
          content="Social Entrepreneur Community - Grow and Promote your Business."
        />
        <meta
          name="twitter:image"
          content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png"
        />
      </Helmet>
      <Routes>
        <Route
          path={RoutesPath.home}
          element={
            <HomePage
              socket={socket}
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.marketPlace}
          element={
            <MarketPlacePage
              socket={socket}
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.myProfile}
          element={
            <MyProfile
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.communities}
          element={
            <CommunitiesPage
              socket={socket}
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.forum}
          element={
            <Forum
              socket={socket}
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.CreateBossup}
          element={
            <CreateBossup
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />

        <Route
          path={RoutesPath.promotePost}
          element={
            <PromotePage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.settings}
          element={
            <SettingsPage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
              onClick={() => {}}
              text={""}
            />
          }
        />
        <Route
          path={RoutesPath.invite}
          element={
            <InvitePage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.notifications}
          element={
            <NotificationPage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.subscriptionpage}
          element={
            <SubscriptionPage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.refer}
          element={
            <ReferPage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.homeSearch}
          element={<HomeSearch onClosePopup={closePopup} />}
        />
        <Route
          path={RoutesPath.connections}
          element={
            <ConnectionsPage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.register}
          element={<RegisterPage onSuccess={fetchData} />}
        />
        <Route
          path={RoutesPath.communitiesSearch}
          element={<Bossupsearch onClosePopup={() => {}} />}
        />
        <Route
          path={RoutesPath.login}
          element={<LoginPage onLoginSuccess={fetchData} />}
        />
        <Route
          path={RoutesPath.verifyOtp}
          element={<OtpVerificationPage onSuccess={fetchData} />}
        />
        <Route
          path={RoutesPath.forgotPassword}
          element={<RequestOtpForForgotPassword />}
        />
        <Route
          path={RoutesPath.editProfile}
          element={
            <EditProfilePage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.chats}
          element={
            <ChatPage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.ChatRoom}
          element={
            <ChatRoomPage
              socket={socket}
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route path={RoutesPath.CreateListing} element={<CreateListing />} />
        <Route
          path={RoutesPath.PublicUserProfile}
          element={
            <PublicUserProfile
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.analysepage}
          element={
            <AnalysePage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.communityrules}
          element={
            <CommunityRules
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.invitetandcs}
          element={
            <Invitetandcs
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.analyseprofilepage}
          element={
            <AnalyseProfilePage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.connectrelevant}
          element={<ConnectRelevant />}
        />
        <Route
          path={RoutesPath.rankingpage}
          element={
            <RankingPage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.explorebusinessbosses}
          element={
            <ExploreBusinessBosses
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.sellerreview}
          element={
            <SellerReview
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route path={RoutesPath.expandedimages} element={<ExpandedImages />} />
        <Route
          path={RoutesPath.bossuppartners}
          element={<Bossuppartnerpage />}
        />
        <Route
          path={RoutesPath.connectrelevantpage}
          element={
            <ConnectRelevantPage
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.subscriptionconfirmationpage}
          element={<SubscriptionConfirmationPage />}
        />
        <Route
          path={RoutesPath.renewsubscriptionconfirmationpage}
          element={<RenewSubscriptionConfirmationPage />}
        />
        <Route
          path={RoutesPath.boostpostconfirmationpage}
          element={<BoostPostConfirmationPage />}
        />
        <Route path={RoutesPath.boostpost} element={<BoostPost />} />
        <Route
          path={RoutesPath.reviewpaymentpage}
          element={<ReviewPaymentPage />}
        />
        <Route
          path={RoutesPath.subscriptionfailedpage}
          element={<SubscriptionFailedPage />}
        />
        <Route
          path={RoutesPath.computerbossupsectionpage}
          element={
            <ComputerBossuppartnersection
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route
          path={RoutesPath.liveevent}
          element={
            <Liveevent
              partnerData={partnerData}
              partnerDatatile={partnerDatatile}
            />
          }
        />
        <Route path={RoutesPath.boostpost} element={<BoostPost />} />
        <Route path={RoutesPath.expandedshop} element={<Expandedshop />} />
        <Route
          path={RoutesPath.listingselectorpage}
          element={<CreateListingSelectorpage />}
        />
        <Route path={RoutesPath.index} element={<LandingPage />} />
        <Route path={RoutesPath.landingpage} element={<LandingPage />} />
        <Route
          path={RoutesPath.landingpageforpartners}
          element={<LandingPageforPartners />}
        />
        <Route
          path={RoutesPath.becomeapartner}
          element={<BecomeAPartnerPage />}
        />
        <Route
          path={RoutesPath.businesstools}
          element={<BusinessToolsPage />}
        />
        <Route path={"/:value"} element={<ShopView />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path={RoutesPath.createPost}
            element={
              <CreatePost
                partnerData={partnerData}
                partnerDatatile={partnerDatatile}
              />
            }
          />
          <Route
            path={"/setupshop"}
            element={
              <SetupShop
                partnerData={partnerData}
                partnerDatatile={partnerDatatile}
              />
            }
          />
          <Route path={"/privacypolicy"} element={<PrivacyPolicy />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="my-shop" element={<MyShop />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="setup" element={<Setup />} />
            <Route
              path="edit-shop"
              element={
                <SetupShop
                  shop={shop!}
                  partnerData={partnerData}
                  partnerDatatile={partnerDatatile}
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
