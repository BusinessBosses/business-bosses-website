import React, { useRef, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import SegmentedControl from "../../../common/components/segmented_control/SegmentedControl";
const SubscriptionPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const controlRef = useRef<HTMLDivElement>(null);
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
          segments={[
            { label: "One", ref: useRef<HTMLDivElement>(null), value: "One" },
            { label: "Two", ref: useRef<HTMLDivElement>(null), value: "Two" },
          ]}
          controlRef={controlRef}
          name=""
          defaultIndex={selectedIndex}
          callback={(_: string, index: number) => {
            setSelectedIndex(index);
          }}
        />
      </div>
      SubscriptionPage
    </div>
  );
};

export default SubscriptionPage;
