import React from "react";
import Assets from "../../../../assets";
import { FiLink } from "react-icons/fi";

const About = () => {
  return (
    <div className="px-5">
      <p>Coding for life</p>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-2">
          <FiLink />
          <small className="text-xs underline">onfile.com</small>
        </div>
        <button className="bg-[#F4F4F4] p-2.5 rounded-full">
          <img src={Assets.Instagram} className="w-3 h-3" alt="" />
        </button>

        <button className="bg-[#F4F4F4] p-2.5 rounded-full">
          <img src={Assets.Twitter} className="w-3 h-3" alt="" />
        </button>
      </div>
      <div className="my-4">
        <h3 className="text-xl font-medium">Achievements</h3>
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 my-5 bg-[rgba(0,0,0,.1)] p-2 rounded-lg"
          >
            <img src={Assets.Trophy} alt="" />
            <p>Tech crunch distrupt</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-medium">Products</h3>
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 my-5 bg-[rgba(0,0,0,.1)] p-2 rounded-lg"
          >
            <img src={Assets.Product} alt="" />
            <p>Tech crunch distrupt</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
