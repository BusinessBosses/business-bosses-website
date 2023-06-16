import { BsFillCheckCircleFill } from "react-icons/bs";
import Assets from "../../../../assets";

const Banner = () => {
  const perks: string[] = [
    "More likes on posts",
    "More Connections",
    "More Referrals",
  ];
  return (
    <div className="relative">
      <img src={Assets.BoostBnner} className="w-full" alt="" />
      <div className="absolute top-5 px-3">
        <p className="text-white text-2xl font-bold">Reach Wider Audience</p>
        <div className="">
          {perks.map((perk, index) => (
            <Perk text={perk} key={index} />
          ))}
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
