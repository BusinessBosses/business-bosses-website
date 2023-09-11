import { BsFillCheckCircleFill } from "react-icons/bs";
import Assets from "../../../../assets";

const Banner = () => {
  const perks: string[] = [
    "More likes on posts",
    "More Connections",
    "More Referrals",
  ];
  return (
    <div style={{ position: "relative" }}>
                        <img src={Assets.BoostBanner} alt="Boost Banner" />
                        <div style={{ position: "absolute", bottom: 20, left: 0, width: "100%", }}>
                            <div className='pl-5  text-white'>
                                <div className='font-black text-lg'> Reach</div>
                                <div className='font-black text-lg'> a Wider Audience</div>
                                <div className='flex pt-3'>
                                    <input type="checkbox" checked disabled />
                                    <div className='text-xs lg:text-base pl-2'>More likes on posts</div>
                                </div>
                                <div className='flex pt-1'>
                                    <input type="checkbox" checked disabled />
                                    <div className='text-xs lg:text-base pl-2'>More connections</div>
                                </div>
                                <div className='flex pt-1' >
                                    <input type="checkbox" checked disabled />
                                    <div className='text-xs lg:text-base pl-2'>More referrals</div>
                                </div>
                            </div>
                        </div>
                    </div>
  );
};

export default Banner;

interface PerkInterface {
  text: string;
}

const Perk = ({ text }: PerkInterface) => {
  return (
    <div className="flex gap-2 my-4">
      <BsFillCheckCircleFill color="white" />
      <small className="text-white font-semibold">{text}</small>
    </div>
  );
};
