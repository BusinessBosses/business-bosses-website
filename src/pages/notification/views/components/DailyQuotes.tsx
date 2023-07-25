import Assets from "../../../../assets";
import { Quote } from "../../../../common/interfaces/quote";
interface Props {
  quote: Quote;
}
const DailyQuotes = ({ quote }: Props) => {
  return (
    <div>
      <div className="mobile-only">
        <div className="bg-[#F4F4F4] p-5">
          <div className="flex items-center gap-3">
            <img src={Assets.Logo} className="w-8 h-8" alt="" />
            <h3 className="text-2xl font-semibold">Today’s Quote</h3>
          </div>
          <p className="text-[#6B6969] text-sm mt-3">
            Lorem ipsum dolor sit amet consectetur. Cras viverra porta eget
            congue massa eget pellentesque a. Enim molestie massa arcu vitae dui
            pharetra viverra varius mus. Ullamcorper quam in turpis sit
          </p>
          <h4 className="font-bold mt-2 text-end">Benjamin Franklin</h4>
        </div>
      </div>

      <div className="computer-only">
        <div className="bg-[#f4f4f4] p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <img src={Assets.Logo} className="w-8 h-8" alt="" />
            <h3 className="text-2xl font-semibold">Today’s Quote</h3>
          </div>
          <p className="text-[#6B6969] text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur. Cras viverra porta eget
            congue massa eget pellentesque a. Enim molestie massa arcu vitae dui
            pharetra viverra varius mus. Ullamcorper quam in turpis sit
          </p>
          <h4 className="font-bold mt-5 text-start">Benjamin Franklin</h4>
        </div>
      </div>
      <p className="text-[#6B6969] text-sm mt-3">{quote.message}</p>
      <h4 className="font-bold mt-2 text-end">{quote.by}</h4>
    </div>
  );
};

export default DailyQuotes;
