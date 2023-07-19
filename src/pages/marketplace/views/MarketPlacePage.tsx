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
} from "../../../redux/slices/MarketSlice";
import { useEffect, useState } from "react";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { Market } from "../../../common/interfaces/Market";
const MarketPlacePage = () => {
  const market = useAppSelector((state) => state.market);
  const [loading, setLoading] = useState<boolean>(false);
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
        {market.markets.map((market) => (
          <MarketItem data={market} key={market.marketId} />
        ))}
      </div>
      <div className="my-20"></div>
      <MobileBottomNav currentIndex={2} />
    </div>
  );
};

export default MarketPlacePage;
