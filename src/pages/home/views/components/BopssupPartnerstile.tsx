import React, { useState, useEffect } from "react"; // Import React and its hooks
import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";
import RoutesPath from "../../../../constants/Routes";

const BossupPartnerstile = () => {
  const navigate = useNavigate();
  const [bossupby, setBossupby] = useState(""); // State to store bossupby
  const [bossupad, setBossupad] = useState(""); // State to store bossupad

  const handleButtonClick = () => {
    const confirmMessage = 'Are you sure you want to leave this page?';
    if (window.confirm(confirmMessage)) {
      window.open('https://businessbosses.news/our-partners/', '_blank');
    } else {
      // Handle cancel
    }
  };

  useEffect(() => {
    // Fetch data from your API using a fetch or axios
    // Replace $ServerUrl with your actual server URL
    fetch('https://orca-app-5dg8w.ondigitalocean.app/api/v1/partner/all')
      .then((response) => response.json())
      .then((data) => {
        if (data.count > 0) {
          const bossUp = data.rows;
          const getTitle = bossUp.find((item: { id: number; }) => item.id === 5);

          if (getTitle) {
            setBossupby(getTitle.companyName);
            setBossupad(getTitle.companyUrl);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to run the effect once when the component mounts

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
          {bossupby}
        </div>
        <p className="text-[#545151] font-semibold text-sm pl-2 py-1" onClick={() => navigate(RoutesPath.bossuppartners)}>
          {bossupad}
        </p>
      </div>
      <Assets.Nexticon className="text-[#232324]" width={20} />
    </div>
  );
};

export default BossupPartnerstile;
