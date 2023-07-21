import { CiSearch } from "react-icons/ci";
import MobileMarketIntro from "./components/MobileMarketIntro";
import MarketItem from "./components/MarketItem";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import MarketController from "../controller/MarketController";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import {
  addMarketsToState,
  incrementPage,
  saveCount,
  updateListing,
} from "../../../redux/slices/MarketSlice";
import { useEffect, useState } from "react";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { Market } from "../../../common/interfaces/Market";
import GeneralPostsController, {
  CoinStruct,
  LikeStruct,
} from "../../../common/controllers/GeneralPostsController";
import { Socket } from "socket.io-client";
import { saveUserData } from "../../../redux/slices/UserSlice";
import { Comment as CommentStruct } from "../../../common/interfaces/comment";
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
      <div className="fixed top-0 w-full z-50">
        <div className="flex items-center p-5 justify-between bg-white">
          <p className="text-lg">Marketplace</p>
          <CiSearch size={20} />
        </div>
      </div>

      <div className="mt-20">
        <MobileMarketIntro />
      </div>

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
          onReload={() => {
            fetchCall();
          }}
        />
      ) : null}

      <div className="p-5">
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
  );
};

export default MarketPlacePage;
