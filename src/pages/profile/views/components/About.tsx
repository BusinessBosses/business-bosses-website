import Assets from "../../../../assets";
import { FiLink } from "react-icons/fi";
import { User } from "../../../../common/interfaces/user";
import { Industry } from "../../../../common/interfaces/industry";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";

interface Props {
  data: User;
}

const About = ({ data }: Props) => {
  const navigate = useNavigate();
  const handleButtonClick = (url: string | URL | undefined) => {
    const confirmMessage = 'Are you sure you want to leave this page?';
    if (window.confirm(confirmMessage)) {
      window.open(url, '_blank');
    } else {
      // Handle the cancel action
    }
  };
  return (
    <div className="px-4 pt-10">
      <div
        className="overflow-auto"
        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
      >
        {data.bio}
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-2" onClick={() => {  handleButtonClick(`https://${data.website}`)  }}>
          <FiLink />
          <small className="text-xs underline">{data.website}</small>
        </div>

        {data.twitter && (
          <button className="bg-[#F4F4F4] p-2.5 rounded-full" onClick={() => { handleButtonClick(`https://twitter.com/${data.twitter}`) }}>
            <img src={Assets.Twitter} className="w-3 h-3" alt="" />
          </button>
        )}
        {data.instagram && (
          <button className="bg-[#F4F4F4] p-2.5 rounded-full" onClick={() => { handleButtonClick(`https://www.instagram.com/${data.instagram}`) }}>
            <img src={Assets.Instagram} className="w-3 h-3" alt="" />
          </button>
        )}
      </div>
      {/* Products and Services section */}
      {data.productsandservices &&
        data.productsandservices.length > 0 &&
        data.productsandservices[0] !== "" && (
          <div className="mt-10">
            <h3 className="text-lg font-bold">Products and Services</h3>
            {data.productsandservices.map((product: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 my-2 max-w-max bg-[#f4f4f4] px-4 py-1 rounded-full"
              >
                <div className="rounded-full w-4 h-4 bg-white my-2"></div>
                <p>{product}</p>
              </div>

            ))}
          </div>
        )}
      {data.interests && data.interests.length > 0 && (
        <div className="my-4">
          <h3 className="text-lg font-bold pb-2">Interests</h3>
          {data.interests.map((interest: Industry, index: number) => (
            <button
              onClick={() => {
                if (index === 0) {
                  navigate("/communities");
                } else {
                  navigate(RoutesPath.forum, { state: interest });
                }
              }}
              key={index}
              className="flex items-center w-full justify-between border border-[#f1f1f1] p-3 rounded-lg"

            >
              <p className="">{interest.industry}</p>
              <Assets.NextIconPrimary />
            </button>
          ))}
        </div>
      )}
      {data.achievements && data.achievements.length > 0 && (
        <div className="my-4">
          <h3 className="text-lg font-bold">Achievements</h3>
          {data.achievements.map((achievement: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 my-5 bg-[#f1f1f1] p-2 rounded-lg"
            >
              <img src={Assets.Trophy} alt="" />
              <p>{achievement}</p>
            </div>
          ))}
        </div>
      )}


    </div>
  );
};

export default About;
