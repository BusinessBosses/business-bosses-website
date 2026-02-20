import React, { useState } from "react";
import ProfeatureTile from "./profeatureitem";

interface ProFeatureItem {
  iconPath: string;
  caption: string;
  subtext?: string;
  color?: string;
  iconcolor?: string;
}

const ProSubscribeSection: React.FC<{ isGrow?: boolean }> = ({ isGrow }) => {
  const [paymentMethodId, setPaymentMethodId] = useState<string>("Proyear");
  const [loading, setLoading] = useState<boolean>(false);

  const proFeatures: ProFeatureItem[] = [
    {
      iconPath: "/src/assets/icons/checkfilled.svg",
      caption: "Your Own Biz-Centre",
      subtext: "Showcase your products/services and convert visits into sales",
    },
    {
      iconPath: "/src/assets/icons/checkfilled.svg",
      caption: "Monetize Your Expertise",
      subtext:
        "Launch your brand as a coach, consultant, freelancer, solopreneur or a small business owner",
    },
    {
      iconPath: "/src/assets/icons/checkfilled.svg",
      caption: "Smart Business Tools",
      subtext: "Manage inventory, tasks, schedules & expenses",
    },
    {
      iconPath: "/src/assets/icons/checkfilled.svg",
      caption: "Centralised Dashboard",
      subtext: "Track all orders from different sales channel",
    },
    {
      iconPath: "/src/assets/icons/checkfilled.svg",
      caption: "Customer Engagement",
      subtext: "Manage customer records and communications",
    },
    {
      iconPath: "/src/assets/icons/checkfilled.svg",
      caption: "Virtual Office Address",
      subtext: "Boost your professional image",
    },
  ];

  return (
    <div className="relative">
      <div className="w-2/3">
        <div className="overflow-y-auto">
          <div className="flex flex-col items-start">
            <div className="mt-4 w-full">
              <div className="rounded-xl bg-backgroundcolor border border-gray-200 p-4">
                <div className="mt-1">
                  <h2 className="text-lg font-bold">Benefits of My-Biz</h2>
                  <div className="mt-5">
                    {proFeatures.map((feature, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <ProfeatureTile
                          backgroundColor="transparent"
                          feature={feature}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isGrow !== undefined && (
              <div className={isGrow ? "h-2" : "h-10"} />
            )}

            {isGrow === undefined && <div className="h-24" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProSubscribeSection;
