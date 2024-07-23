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
      {/* <div
        className="mobile-only"
        style={{ borderTop: "15px solid #f4f4f4" }}
      ></div> */}
      <div className="bg-[#fff] mx-1 rounded-lg flex justify-center items-center">
        <div className="bg-[#fff] py-1items-center">
          <p className="text-[#383838] text-md  pb-5 font-bold lg:text-base">
            {adtitle}
          </p>

          <div
            onClick={handleButtonClick}
            className="flex items-center gap-2 rounded-lg"
          >
            <div
              style={{
                backgroundColor: "lightgray", 
                borderRadius: "50%", 
                display: "inline-flex", 
                alignItems: "center",
                justifyContent: "center",
                padding: "5px", 
              }}
            >
              <Assets.Upicon style={{ height: 10, width: 10 }} />
            </div>

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
