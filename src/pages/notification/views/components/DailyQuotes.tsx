import Assets from "../../../../assets";
import { Quote } from "../../../../common/interfaces/quote";
import ComputerBossuppartnersection from "../../../bossuppartnerpage/computerbossupsection";
interface Props {
  quote: Quote;
}
const DailyQuotes = ({ quote }: Props) => {
  return (
    <div>
      <div className="mobile-only">
        <div className="bg-[#F4F4F4] p-5">
          <h3 className="text-sm font-semibold">Today’s Quote</h3>
          <div className="flex items-center gap-3 mt-3">
  <img src={Assets.Logo} className="w-8 h-8" alt="" />
  <p className="text-[#6B6969] text-sm mt-0">
    {quote.message}
  </p>
</div>


          <h4 className="font-bold mt-2 text-end">{quote.by}</h4>
        </div>
      </div>

      <div className="computer-only">
        <div className="bg-[#f4f4f4] p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <img src={Assets.Logo} className="w-8 h-8" alt="" />
            <h3 className="text-2xl font-semibold">Today’s Quote</h3>
          </div>
          <p className="text-[#6B6969] text-sm mt-5">
            {quote.message}
          </p>
          <h4 className="font-bold mt-5 text-start">{quote.by}</h4>
        </div>
        <div className="mt-5"><ComputerBossuppartnersection/></div>
        
      </div>
    </div>
  );
};

export default DailyQuotes;
