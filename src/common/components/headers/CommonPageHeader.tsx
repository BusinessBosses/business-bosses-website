import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
interface Props {
  title: string;
}
const CommonPageHeader = ({ title }: Props) => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <div className="mobile-only bg-white p-5 flex items-center justify-between flex-row"> {/* Add flex-row class here */}
          <button onClick={() => navigate(-1)}>
            <BiArrowBack size={20} />
          </button>
          <p className="text-xl font-medium">{title}</p>
          {/* Remove the empty <div /> since it's not needed */}
        </div>


      </div>


      <div className="computer-only bg-white pb-5 mt-10 ml-5 flex items-center justify-between">
      <div className="flex items-center"> {/* Wrapping div */}
        <button onClick={() => navigate(-1)} className="flex items-center mr-5">
          <BiArrowBack size={20} />
        </button>
        <p className="text-2xl font-bold">{title}</p>
      </div>
      <div />
    </div>

    </div>
  );
};

export default CommonPageHeader;
