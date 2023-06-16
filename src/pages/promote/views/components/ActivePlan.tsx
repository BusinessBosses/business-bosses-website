import { PlanInterface } from "../PromotePage";

interface Props {
  plan: PlanInterface;
  onChangePlan: VoidFunction;
}
const ActivePlan = ({ plan, onChangePlan }: Props) => {
  return (
    <div
      onClick={onChangePlan}
      className="border-2 p-3 my-3 rounded-lg border-primary flex justify-between items-start"
    >
      <div className="">
        <p className="text-[#333333] font-semibold">${plan.amount} </p>
        <div className="bg-[#F4F4F4] py-0.5 px-3 rounded">
          <small className="text-[#232324]">{plan.duration}</small>
        </div>
        <small className="text-[#777777]">{plan.reach}</small>
      </div>
      <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center">
        <div className="bg-white h-4 w-4 rounded-full"></div>
      </div>
    </div>
  );
};

export default ActivePlan;
