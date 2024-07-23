import React, { useState, useEffect } from "react"; // Ensure React hooks are imported
import axios from "axios"; // Ensure axios is imported
import BossupPartnerstile from "../../../home/views/components/BopssupPartnerstile";
import PartnerCard from "../../../bossuppartnerpage/components/partnercard";
import { PartnerData } from "../../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../../common/interfaces/partnerdatatile";

interface PartnersFieldProps {
  initialPartnerData: PartnerData | null;
  initialPartnerDatatile: PartnerDatatile | null;
}

const PartnersField: React.FC<PartnersFieldProps> = ({
  initialPartnerData,
  initialPartnerDatatile,
}) => {
  const [partnerData, setPartnerData] = useState<PartnerData | null>(
    initialPartnerData
  );
  const [partnerDatatile, setPartnerDatatile] =
    useState<PartnerDatatile | null>(initialPartnerDatatile);

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      const response = await axios.get(
        "https://orca-app-5dg8w.ondigitalocean.app/api/v1/partner/all"
      );

      if (response.status === 200) {
        const partnerData = response.data.data; // Access the "data" property

        if (partnerData && partnerData.rows) {
          // Check if "rows" exists and is an array
          const partners = partnerData.rows;

          // Find the partner with id 12
          const getTitle = partners.find(
            (item: { id: number }) => item.id === 12
          );

          if (getTitle) {
            setPartnerData({
              partnerlogo: getTitle.companyPhoto,
              adtitle: getTitle.companyName,
              addescription: getTitle.companyDescription,
              partnerurl: getTitle.companyUrl,
            });
          }
        }
      } else {
        console.error("Failed to fetch partner data.");
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
    }
  };

  const handleMessageUsButtonClick = () => {
    const confirmMessage = "Are you sure you want to leave this page?";
    if (window.confirm(confirmMessage)) {
      window.open("https://businessbosses.news/our-partners/", "_blank");
    } else {
      // Handle the cancel action
    }
  };

  return (
    <div>
      {/* <div className="mb-5">Partner Deals</div> */}
      <div className="flex overflow-x-auto">
        <div className="min-w-[50px] bg-[#fff] rounded-2xl p-3 mx-2">
          {partnerData ? (
            <PartnerCard
              partnerlogo={partnerData.partnerlogo}
              adtitle={partnerData.adtitle}
              addescription={partnerData.addescription}
              partnerurl={partnerData.partnerurl}
            />
          ) : (
            <p>Loading partner data...</p>
          )}
        </div>
        <div className="min-w-[50px] bg-[#fff] rounded-2xl p-3 mx-2">
          {partnerData ? (
            <PartnerCard
              partnerlogo={partnerData.partnerlogo}
              adtitle={partnerData.adtitle}
              addescription={partnerData.addescription}
              partnerurl={partnerData.partnerurl}
            />
          ) : (
            <p>Loading partner data...</p>
          )}
        </div>
        <div className="min-w-[50px] bg-[#fff] rounded-2xl p-3 mx-2">
          {partnerData ? (
            <PartnerCard
              partnerlogo={partnerData.partnerlogo}
              adtitle={partnerData.adtitle}
              addescription={partnerData.addescription}
              partnerurl={partnerData.partnerurl}
            />
          ) : (
            <p>Loading partner data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnersField;
