import { ReactNode } from "react";
import Popup from "reactjs-popup";
import Assets from "../../../assets";
import FilledButtonsmall from "../buttons/FilledButtonsmall";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";

const NotsignedinPopUp = () => {
  const navigate = useNavigate();


  return (
    <div className="justify-center items-center">
      <img src={Assets.Notsignedinpopupback} />
      <div className="p-5">
      <div className="justify-center items-center pb-3"><FilledButtonsmall className="px-8 py-3" onClick={() => navigate(RoutesPath.register)} text={"Sign Up"} /></div>
      <div className="flex gap-2">
        <div className="text-sm">Already have an account?</div>
        <div className="text-primary text-sm font-bold">Log in</div>
      </div>
      </div>

    </div>
  );
};

export default NotsignedinPopUp;
