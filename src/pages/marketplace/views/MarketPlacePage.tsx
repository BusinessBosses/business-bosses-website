import { CiSearch } from "react-icons/ci";
import MarketItem from "./components/MarketItem";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import MobileMarketIntro from "./components/MarketIntro";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { useEffect, useRef, useState } from "react";
import MarketController from "../controller/MarketController";
import {
  addMarketsToState,
  addMembersToState,
  incrementPage,
  saveCount,
  updateListing,
} from "../../../redux/slices/MarketSlice";
import { Market } from "../../../common/interfaces/Market";
import GeneralPostsController, {
  CoinStruct,
  LikeStruct,
} from "../../../common/controllers/GeneralPostsController";
import { saveUserData } from "../../../redux/slices/UserSlice";
import { Comment as CommentStruct } from "../../../common/interfaces/comment";
import { Socket } from "socket.io-client";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import Marketplacepopup from "../../popups/Marketplacepopup";
import Marketplacesearchpopup from "../../popups/Marketplacesearchpopup";
import BossupPartnerstile from "../../home/views/components/BopssupPartnerstile";
import Bossuppartnerpage from "../../bossuppartnerpage/bossuppartnerpage";
import { User } from "../../../common/interfaces/user";
import Computerlefttabsignedoutuser from "../../profile/views/components/Computerlefttabsignedoutuser";
interface Props {
  socket: Socket;
}
const MarketPlacePage = ({ socket }: Props) => {
  const market = useAppSelector((state) => state.market);
  const [loading, setLoading] = useState<boolean>(false);
  const profile = useAppSelector((state) => state.user);
  const [err, setErr] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const fetchMarketUsers = async () => {
    const response = await MarketController.fetchMarketUsers();
    if (response.success) {
      dispatch(addMembersToState(response.data.rows.map((mp: any) => mp.user)));
    }
  };

  const fetchCall = async () => {
    setLoading(true);
    setErr(false);
    const response = await MarketController.fetchMarkets(market.page);
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

    setLoading(false);
  };

  const onLike = (args: LikeStruct, postIndex: number) => {
    let post = market.markets[postIndex];
    if (post.likes!.includes(profile.profile?.uid!)) {
      post = {
        ...post,
        likes: post.likes!.filter((ft) => ft !== profile.profile!.uid),
      };
    } else {
      post = {
        ...post,
        likes: [...post.likes!, profile.profile!.uid],
      };
    }
    dispatch(updateListing({ index: postIndex, post }));
    GeneralPostsController.like(args, socket);
  };

  const onCoin = (args: CoinStruct, postIndex: number) => {
    let post = market.markets[postIndex];
    if (post.coins!.includes(profile.profile?.uid!)) {
      post = {
        ...post,
        coins: post.coins!.filter((ft) => ft !== profile.profile!.uid),
      };
      dispatch(
        saveUserData({
          ...profile.profile!,
          coinscount: profile.profile!.coinscount! + 1,
        })
      );
    } else {
      post = {
        ...post,
        coins: [...post.coins!, profile.profile!.uid],
      };
      dispatch(
        saveUserData({
          ...profile.profile!,
          coinscount: profile.profile!.coinscount! - 1,
        })
      );
    }
    dispatch(updateListing({ index: postIndex, post }));
    GeneralPostsController.coin(args, socket);
  };

  const onComment = (comment: CommentStruct, postIndex: number) => {
    let post = market.markets[postIndex];
    post = {
      ...post,
      comments: [...post.comments!, comment],
    };
    dispatch(updateListing({ index: postIndex, post }));
  };

  useEffect(() => {
    if (!!!market.markets.length) {
      fetchCall();
      fetchMarketUsers();
    }
  }, []);

  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleOutsideInteraction);
      document.addEventListener("touchstart", handleOutsideInteraction);
    } else {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [isPopupOpen]);

  return (
    <div>
      <div className="mobile-only bg-white" style={{}}>
        <div
          className="bg-white top-0 w-full z-50"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div className="flex items-center justify-between bg-white px-3 py-2">
            <p className="text-lg font-semibold text-[#333333]">Marketplace</p>
            <CiSearch
              onClick={openPopup}
              size={40}
              style={{ padding: 7 }}
              strokeWidth={0.5}
            />
          </div>
        </div>

        <div className="">
          <MobileMarketIntro />
        </div>

        <div className="">
          {loading ? (
            <FetchStatus
              error={false}
              errorMessage="Something went wrong!!"
              loading={true}
              onReload={() => {}}
            />
          ) : null}
          {err ? (
            <FetchStatus
              error={true}
              errorMessage="Something went wrong!!"
              loading={false}
              onReload={fetchCall}
            />
          ) : null}
          {market.markets.map((market: Market, index: number) => (
            <MarketItem
              onComment={(comment: CommentStruct) => {
                onComment(comment, index);
              }}
              onLike={(postId: string) => {
                onLike(
                  {
                    postId,
                    type: "marketplace",
                    userId: profile.profile!.uid,
                    receiverUid: market.user!.uid,
                  },
                  index
                );
              }}
              onCoin={(postId: string) => {
                onCoin(
                  {
                    postId,
                    type: "marketplace",
                    userId: profile.profile!.uid,
                    receiverUid: market.user!.uid,
                    timestamp: Date.now(),
                  },
                  index
                );
              }}
              data={market}
              key={market.marketId}
            />
          ))}
        </div>
        <div className="my-20"></div>
        <MobileBottomNav currentIndex={2} />
      </div>

      {isPopupOpen && (
        <div className="overlay">
          <div className="mobilepopup" style={{ overflowY: "scroll" }}>
            <Marketplacesearchpopup />
          </div>
        </div>
      )}

      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5 pl-0"
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
              {profile.profile?.email != `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                    <ComputerProfileDetails data={profile.profile!} /> : <Computerlefttabsignedoutuser data={profile.profile!} />}
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >
            <div className="">
              {loading ? (
                <FetchStatus
                  error={false}
                  errorMessage="Something went wrong!!"
                  loading={true}
                  onReload={() => {}}
                />
              ) : null}
              {err ? (
                <FetchStatus
                  error={true}
                  errorMessage="Something went wrong!!"
                  loading={false}
                  onReload={fetchCall}
                />
              ) : null}
              {market.markets.map((market: Market, index: number) => (
                <MarketItem
                  onComment={(comment: CommentStruct) => {
                    onComment(comment, index);
                  }}
                  onLike={(postId: string) => {
                    onLike(
                      {
                        postId,
                        type: "marketplace",
                        userId: profile.profile!.uid,
                        receiverUid: market.user!.uid,
                      },
                      index
                    );
                  }}
                  onCoin={(postId: string) => {
                    onCoin(
                      {
                        postId,
                        type: "marketplace",
                        userId: profile.profile!.uid,
                        receiverUid: market.user!.uid,
                        timestamp: Date.now(),
                      },
                      index
                    );
                  }}
                  data={market}
                  key={market.marketId}
                />
              ))}
            </div>
            <div className="my-20"></div>
          </div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection ml-5 mr-5 mt-5 lg:mr-20"
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
              <MobileMarketIntro />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlacePage;
