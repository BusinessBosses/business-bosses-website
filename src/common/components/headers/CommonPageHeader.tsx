import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
interface Props {
  title: string;
}
const CommonPageHeader = ({ title }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-5 flex items-center justify-between">
      <button onClick={() => navigate(-1)}>
        <BiArrowBack size={20} />
      </button>
      <p className="text-xl font-medium">{title}</p>
      <div />
    </div>
  );
};

export default CommonPageHeader;
