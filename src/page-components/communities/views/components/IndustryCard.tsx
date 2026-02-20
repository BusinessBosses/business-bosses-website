import RoutesPath from "../../../../constants/Routes";
import { useRouter } from "next/navigation";
import { Industry } from "../../../../common/interfaces/industry";
import Assets from "../../../../assets";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../redux/store/store";
interface Props {
  industry: Industry;
}
const IndustryCard = ({ industry }: Props) => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const profile = useAppSelector((state) => state.user);
  

  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
  }, [isPopupOpen]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleButtonClick = () => {
    const confirmMessage = 'You need to sign in or create an account to be able to use this feature';
    if (window.confirm(confirmMessage)) {
      router.push(RoutesPath.login)
    } else {

    }
  };
  return (
    <div>
    <div
      className="bg-white shadow p-2 rounded-xl mobile-only"
      onClick={profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
      handleButtonClick : ()=>router.push(RoutesPath.forum, { state: industry })}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#333333] text-sm font-[700]">{industry.industry}</p>
        <Assets.Nexticon className="text-primary" stroke="#F21C29"/>
      </div>
      <img
        src={industry.photo}
        className="h-25 w-full rounded-lg object-cover"
        alt=""
      />
    </div>

    <div
      className="bg-white shadow p-2 rounded-xl computer-only"
      onClick={profile.profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                handleButtonClick : ()=>router.push(RoutesPath.forum, { state: industry })}
    
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[#333333] text-base font-[700] ">{industry.industry}</p>
        <Assets.Nexticon  stroke="#F21C29" className="text-primary" />
      </div>
      <img
        src={industry.photo}
        className="h-30 w-full rounded-lg object-cover"
        alt=""
      />
    </div>
    </div>
  );
};

export default IndustryCard;
