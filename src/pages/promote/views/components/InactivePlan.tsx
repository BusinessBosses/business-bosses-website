import { PlanInterface } from "../PromotePage";

interface Props {
  plan: PlanInterface;
  onChangePlan: VoidFunction;
}
const InactivePlan = ({ plan, onChangePlan }: Props) => {
  return (
    <div
      onClick={onChangePlan}
            style={{ borderColor: '#f4f4f4', borderWidth: '4px' }}
      className="p-3 rounded-2xl my-2 lg:my-5 flex justify-between items-start"
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
                        borderColor: '#f4f4f4',
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

export default InactivePlan;
