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
  return (
    <div className="px-4 pt-10">
      <div
        className="overflow-auto"
        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
      >
        {data.bio}
      </div>

      <div className="flex items-center gap-4 mt-3">
        {data.website && (
          <div className="flex items-center gap-2">
            <FiLink />
            <small className="text-xs underline">{data.website}</small>
          </div>
        )}
        {data.instagram && (
          <button className="bg-[#F4F4F4] p-2.5 rounded-full">
            <img src={Assets.Instagram} className="w-3 h-3" alt="" />
          </button>
        )}
        {data.twitter && (
          <button className="bg-[#F4F4F4] p-2.5 rounded-full">
            <img src={Assets.Twitter} className="w-3 h-3" alt="" />
          </button>
        )}
      </div>
      {data.interests && data.interests.length > 0 && (
        <div className="my-4">
          <h3 className="text-lg font-bold">Interests</h3>
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
              className="flex items-center w-full justify-between my-5 border-y-[0.1px] border-y-[#f1f1f1] p-3 rounded-lg"
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

      {/* Products and Services section */}
      {data.productsandservices &&
        data.productsandservices.length > 0 &&
        data.productsandservices[0] !== "" && (
          <div className="mt-10">
            <h3 className="text-xl font-medium">Products</h3>
            {data.productsandservices.map((product: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 my-5 bg-[rgba(0,0,0,.1)] p-2 rounded-lg"
              >
                <img src={Assets.Product} alt="" />
                <p>{product}</p>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default About;
