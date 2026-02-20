import { useRouter } from "next/navigation";
import Assets from "../../../assets";

interface Props {
  title: string;
}

const CommonPageHeader = ({ title }: Props) => {
  const router = useRouter();

  return (
    <div>
      <div className="mobile-only">
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()}>
            <Assets.Backbutton />
          </button>
          <div className="flex-grow text-center">
            <p className="text-md font-semibold">{title}</p>
          </div>
          <div></div> {/* This empty div helps in spacing */}
        </div>
      </div>


      <div className="computer-only bg-white pb-5 pt-5 px-4">
        <div className="flex items-center ">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="flex items-center mr-5">
              <Assets.Backbutton />
            </button>
            <div className="text-center"> {/* Centered title */}
              <p className="text-xl font-bold">{title}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CommonPageHeader;