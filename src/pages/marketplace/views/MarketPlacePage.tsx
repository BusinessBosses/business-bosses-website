import { CiSearch } from "react-icons/ci";
import MarketItem from "./components/MarketItem";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import MobileMarketIntro from "./components/MarketIntro";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { useEffect, useState } from "react";
import MarketController from "../controller/MarketController";
import {
  addMarketsToState,
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
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetails";
interface Props {
  socket: Socket;
}
const MarketPlacePage = ({ socket }: Props) => {
  const market = useAppSelector((state) => state.market);
  const [loading, setLoading] = useState<boolean>(false);
  const profile = useAppSelector((state) => state.user);
  const [err, setErr] = useState<boolean>(false);
  const dispatch = useAppDispatch();
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
    }
  }, []);

  return (
    <div>
      <div className="mobile-only" style={{ paddingTop: 45 }}>
        <div
          className="fixed top-0 w-full z-50"
          style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="flex items-center justify-between bg-white px-3 py-2">
            <p className="text-lg font-semibold text-[#333333]">Marketplace</p>
            <CiSearch size={40} style={{ padding: 7 }} strokeWidth={0.5} />
          </div>
        </div>

        <div className="">
          <MobileMarketIntro />
        </div>

        <div className="">
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


      <div className="computer-only" style={{ paddingTop: 45 }}>
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection ml-5 lg:ml-20 mr-5 pl-0" style={{
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
          <div className="computer-main-content" style={{ paddingTop: 20, width: '40%', flexGrow: 0 }} >
            <div className="">
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
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-5 lg:mr-20" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            paddingTop: 30,



          }}>

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
