import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Assets from "../../../assets";
interface Props {
  title: string;
}
const CommonPageHeader = ({ title }: Props) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mobile-only">
        <div className="bg-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <Assets.Backbutton/>
            </button>
            <p className="text-xl font-medium">{title}</p>
          </div>
        </div>
      </div>



      <div className="computer-only bg-white pb-5 mt-10 flex items-center justify-between">
        <div className="flex items-center"> {/* Wrapping div */}
          <button onClick={() => navigate(-1)} className="flex items-center mr-5">
          <Assets.Backbutton/>
          </button>
          <p className="text-2xl font-bold">{title}</p>
        </div>
        <div />
      </div>

    </div>
  );
};

export default CommonPageHeader;
