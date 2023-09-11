import { PlanInterface } from "../PromotePage";

interface Props {
  plan: PlanInterface;
  onChangePlan: VoidFunction;
}
const ActivePlan = ({ plan, onChangePlan }: Props) => {
  return (
    <div
      onClick={onChangePlan}
      className="border p-3 my-2 lg:my-5 rounded-2xl border-primary flex justify-between items-start"
      style={{ borderColor: '#f21c29', borderWidth: '3px' }}
    >
      <div className="">
        <p className="text-[#333333] font-semibold">${plan.amount}.00 </p>
        <div className='bg-[#f1f1f1] text-xs py-1 px-3 inline-block rounded-md mt-1'>
          {plan.duration}
        </div>
        <div>
        <small className="text-[#777777]">{plan.reach}</small></div>
      </div>
      <div
        className='w-7 h-7 mt-20 rounded-full text-center border'
        style={{
          borderColor: '#f21c29',
          borderWidth: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          marginTop: '0px',
        }}
      ></div>
    </div>
  );
};

export default ActivePlan;
