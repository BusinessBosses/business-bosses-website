import { ReactNode } from "react";
import Popup from "reactjs-popup";
import Assets from "../../../assets";
import FilledButtonsmall from "../buttons/FilledButtonsmall";
import { useRouter } from "next/navigation";
import RoutesPath from "../../../constants/Routes";

const NotsignedinPopUp = () => {
  const router = useRouter();


  return (
    <div className="justify-center items-center">
      <img src={Assets.Notsignedinpopupback} />
      <div className="p-5">
      <div className="justify-center items-center pb-3"><FilledButtonsmall className="px-8 py-3" onClick={() => window.location.href = "https://businessbosses.onelink.me/xLWk/36a2ff16"} text={"Sign Up"} /></div>
      <div className="flex">
        <div className="text-sm">Already have an account?</div>
        <div className="w-2"></div>
        <div className="text-primary text-sm font-bold cursor-pointer" onClick={() => window.location.href = "https://businessbosses.onelink.me/xLWk/36a2ff16"}>Log in</div>
      </div>
      </div>

    </div>
  );
};

export default NotsignedinPopUp;
