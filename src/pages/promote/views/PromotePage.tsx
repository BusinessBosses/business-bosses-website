import { useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Plan from "./components/Plan";
import Banner from "./components/Banner";
import FilledButton from "../../../common/components/buttons/FilledButton";

export interface PlanInterface {
  amount: string;
  duration: string;
  reach: string;
}

const PromotePage = () => {
  const plans: PlanInterface[] = [
    {
      amount: "3",
      duration: "Duration 3 days",
      reach: "Reach 500 to 850 people",
    },
    {
      amount: "5",
      duration: "Duration 5 Days",
      reach: "Reach 900 to 1.2k people",
    },
  ];

  const [currentPlan, setCurrentPlan] = useState<string>(plans[0].amount);

  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Boost Post" />
      </div>
      <div className="my-20"></div>

      <Banner />
      <div className="p-5">
        <h2 className="text-2xl font-bold">Choose your plan</h2>

        {plans.map((plan, index) => {
          return (
            <Plan
              onChangePlan={() => setCurrentPlan(plan.amount)}
              plan={plan}
              active={currentPlan === plan.amount}
              key={index}
            />
          );
        })}

        <FilledButton
          onClick={() => {}}
          text="Continue"
          className="w-full py-3"
        />
      </div>
    </div>
  );
};

export default PromotePage;
