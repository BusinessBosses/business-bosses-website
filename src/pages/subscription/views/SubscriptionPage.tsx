import React, { useState } from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";

const SubscriptionPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      <div className="mobile-only">
        <div
          className="bg-white top-0 w-full z-50"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            borderBottom: "10px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.02)",
          }}
        >
          <CommonPageHeader title="Become a Premium Member" />
        </div>

        <div>Upgrade to a premium boss experience at only $49.99/year</div>

        <SegmentedControl
          values={['One', 'Two']}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </div>
      SubscriptionPage
    </div>
  );
};

export default SubscriptionPage;
