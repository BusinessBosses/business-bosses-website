import React from "react";
import ActivePlan from "./ActivePlan";
import InactivePlan from "./InactivePlan";
import { PlanInterface } from "../PromotePage";
interface Props {
  plan: PlanInterface;
  active: boolean;
  onChangePlan: VoidFunction;
}
const Plan = ({ active, plan, onChangePlan }: Props) => {
  return active ? (
    <ActivePlan onChangePlan={onChangePlan} plan={plan} />
  ) : (
    <InactivePlan onChangePlan={onChangePlan} plan={plan} />
  );
};

export default Plan;
