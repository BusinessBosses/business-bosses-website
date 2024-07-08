import React from "react";
import Assets from "../../../assets";

interface Props {
  partnerlogo: any;
  adtitle: string;
  addescription: string;
  partnerurl: string;
}

const PartnerCard = ({
  partnerlogo,
  addescription,
  adtitle,
  partnerurl,
}: Props) => {
  const handleButtonClick = () => {
    const confirmMessage = "Are you sure you want to leave this page?";
    if (window.confirm(confirmMessage)) {
      window.open(partnerurl, "_blank");
    } else {
      // Handle the cancel action
    }
  };

  return (
    <div>
      <div className="bg-white px-4 py-3 mobile-only flex justify-center items-center">
        <div className="bg-[#ffffff] p-3 mt-2 flex flex-col">
          {/* <img src={partnerlogo} alt="" className="w-40 h-40" /> */}
          <p className="text-[#383838] text-md font-bold lg:text-base">
            {adtitle}
          </p>
          <p className="text-[#383838] text-sm font-medium">{addescription}</p>
          <div
            onClick={handleButtonClick}
            className="flex items-center gap-2 bg-[#f4f4f4] py-3 px-5 mt-5 rounded-lg"
          >
            <Assets.Linkicon />
            <p className="text-[#383838] text-xs lg:text-base font-light underline">
              {partnerurl}
            </p>
          </div>
        </div>
      </div>
      <div
        className="mobile-only"
        style={{ borderTop: "15px solid #f4f4f4" }}
      ></div>
      <div className="bg-[#fff] mx-1 rounded-lg computer-only flex justify-center items-center">
        <div className="bg-[#fff] py-1items-center">
          <p className="text-[#383838] text-md  pb-5 font-bold lg:text-base">
            {adtitle}
          </p>

          <div
            onClick={handleButtonClick}
            className="flex items-center gap-2 rounded-lg"
          >
            <Assets.Upicon style={{ height: 20, width: 20 }} />
            <p className="text-[#383838] text-xs lg:text-sm font-light ">
              Learn more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
