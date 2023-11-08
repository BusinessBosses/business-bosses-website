import Post from "./Post";
import { Market as MarketProp } from "../../../../common/interfaces/Market";
interface Props {
  markets: MarketProp[];
}
const Markets = ({ markets }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 pt-4 bg-[#f4f4f4]" style={{height:"100vh"}}>
      {markets.map((markets) => {
        return (
          <Post
            key={markets.marketId}
            title={markets.description}
            imgUrl={markets.images ? markets.images[0] : undefined}
          />
        );
      })}
    </div>
  );
};

export default Markets;
