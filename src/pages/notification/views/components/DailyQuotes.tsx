import Assets from "../../../../assets";
import { Quote } from "../../../../common/interfaces/quote";
interface Props {
  quote: Quote;
}
const DailyQuotes = ({ quote }: Props) => {
  return (
    <div className="bg-[#F4F4F4] p-5">
      <div className="flex items-center gap-3">
        <img src={Assets.Logo} className="w-8 h-8" alt="" />
        <h3 className="text-2xl font-semibold">Today’s Quote</h3>
      </div>
      <p className="text-[#6B6969] text-sm mt-3">{quote.message}</p>
      <h4 className="font-bold mt-2 text-end">{quote.by}</h4>
    </div>
  );
};

export default DailyQuotes;
