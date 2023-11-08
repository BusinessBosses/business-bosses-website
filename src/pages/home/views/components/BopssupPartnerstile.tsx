import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";
import RoutesPath from "../../../../constants/Routes";

import { PartnerDatatile } from "../../../../common/interfaces/partnerdatatile";


interface Props {
  partnerDatatile: PartnerDatatile | null;
}
const BossupPartnerstile: React.FC<Props> = ({ partnerDatatile }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    const confirmMessage = 'Are you sure you want to leave this page?';
    if (window.confirm(confirmMessage)) {
      window.open('https://businessbosses.news/', '_blank');
    } else {
      // Handle cancel
    }
  };

  

  return (
    <div className="bg-[#ffffff] flex items-center justify-between p-2 rounded-lg mt-2 lg:mt-0">
      <div className="flex items-center">
        <div
          className="text-xs text-[#545151] pr-2"
          onClick={handleButtonClick}
          style={{
            paddingRight: 10,
            borderRight: "1.2px solid rgba(0, 0, 0, 0.5)",
          }}
        >
          {partnerDatatile?.adtitle}
        </div>
        <p className="text-[#545151] mobile-only font-semibold text-sm pl-2 py-1" onClick={() => navigate(RoutesPath.bossuppartners)}>
          {partnerDatatile?.addescription}
        </p>
        <p className="text-[#545151] computer-only font-semibold text-sm pl-2 py-1" onClick={handleButtonClick}>
          {partnerDatatile?.addescription}
        </p>
      </div>
      <Assets.Nexticon className="text-[#232324]" width={20} />
    </div>
  );
};

export default BossupPartnerstile;
