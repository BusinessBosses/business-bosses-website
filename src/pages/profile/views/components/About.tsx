import React from "react";
import Assets from "../../../../assets";
import { FiLink } from "react-icons/fi";
import { User } from "../../../../common/interfaces/user";
interface Props {
  data: User;
}
const About = ({ data }: Props) => {
  return (
    <div className="px-4 pt-10">
      <p>{data.bio}</p>
      <div className="flex items-center gap-4 mt-3">
        {data.website ? (
          <div className="flex items-center gap-2">
            <FiLink />
            <small className="text-xs underline">{data.website}</small>
          </div>
        ) : null}
        {data.instagram ? (
          <button className="bg-[#F4F4F4] p-2.5 rounded-full">
            <img src={Assets.Instagram} className="w-3 h-3" alt="" />
          </button>
        ) : null}

        {data.twitter ? (
          <button className="bg-[#F4F4F4] p-2.5 rounded-full">
            <img src={Assets.Twitter} className="w-3 h-3" alt="" />
          </button>
        ) : null}
      </div>
      {data.achievements && data.achievements.length ? (
        <div className="my-4">
          <h3 className="text-xl font-medium">Achievements</h3>
          {data.achievements.map((achievement: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 my-5 bg-[rgba(0,0,0,.1)] p-2 rounded-lg"
            >
              <img src={Assets.Trophy} alt="" />
              <p>{achievement}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* {data.productsandservices ? (
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
      ) : null} */}
    </div>
  );
};

export default About;
