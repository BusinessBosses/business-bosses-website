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

type Partner = {
  partnerlogo: string,
  adtitle: string,
  addescription: string,
  partnerurl: string,
}

const PartnersField: React.FC<PartnersFieldProps> = ({
  initialPartnerData,
  initialPartnerDatatile,
}) => {
  const [partnerData, setPartnerData] = useState<PartnerData[] | null>(
    null
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
        const partnerData = response.data.data;
        console.log(partnerData); // Access the "data" property

        if (partnerData && partnerData.rows) {
          // Check if "rows" exists and is an array
          const partners = partnerData.rows;

          // Find the partner with id 12
          
          let newpartners = [];
          for (let i = 0; i < partners.length; i++) {
             const getTitle = partners[i]
             newpartners.push({
               partnerlogo: getTitle.companyPhoto,
               adtitle: getTitle.companyName,
               addescription: getTitle.companyDescription,
               partnerurl: getTitle.companyUrl,
             });
           }

           setPartnerData(newpartners)

           console.log(partnerData);
           
          
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
              partnerlogo={partnerData[0].partnerlogo}
              adtitle={partnerData[0].adtitle}
              addescription={partnerData[0].addescription}
              partnerurl={partnerData[0].partnerurl}
            />
          ) : (
            <p>Loading partner data...</p>
          )}
        </div>
        <div className="min-w-[50px] bg-[#fff] rounded-2xl p-3 mx-2">
          {partnerData ? (
            <PartnerCard
              partnerlogo={partnerData[1].partnerlogo}
              adtitle={partnerData[1].adtitle}
              addescription={partnerData[1].addescription}
              partnerurl={partnerData[1].partnerurl}
            />
          ) : (
            <p>Loading partner data...</p>
          )}
        </div>
        <div className="min-w-[50px] bg-[#fff] rounded-2xl p-3 mx-2">
          {partnerData ? (
            <PartnerCard
              partnerlogo={partnerData[2].partnerlogo}
              adtitle={partnerData[2].adtitle}
              addescription={partnerData[2].addescription}
              partnerurl={partnerData[2].partnerurl}
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
