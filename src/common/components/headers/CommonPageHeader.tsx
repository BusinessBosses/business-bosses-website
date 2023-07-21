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

      <div className="computer-only bg-white pb-5 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>

        </button>
        <p className="text-xl font-medium">{title}</p>
        <div />
      </div>

    </div>
  );
};

export default CommonPageHeader;
