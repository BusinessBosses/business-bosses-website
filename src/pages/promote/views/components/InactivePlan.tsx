import { PlanInterface } from "../PromotePage";

interface Props {
  plan: PlanInterface;
  onChangePlan: VoidFunction;
}
const InactivePlan = ({ plan, onChangePlan }: Props) => {
  return (
    <div
      onClick={onChangePlan}
      style={{
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.15)",
      }}
      className="p-3 rounded-lg my-3 flex justify-between items-start"
    >
      <div className="">
        <p className="text-[#333333] font-semibold">${plan.amount} </p>
        <div className="bg-[#F4F4F4] py-0.5 px-3 rounded">
          <small className="text-[#232324]">{plan.duration}</small>
        </div>
        <small className="text-[#777777]">{plan.reach}</small>
      </div>
      <div className="bg-[#ffffff] shadow-lg h-8 w-8 rounded-full flex items-center justify-center"></div>
    </div>
  );
};

export default InactivePlan;
