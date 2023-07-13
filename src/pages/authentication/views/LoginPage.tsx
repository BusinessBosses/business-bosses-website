import { useState } from "react";
import FilledInput from "../../../common/components/inputs/FilledInput";
import Assets from "../../../assets";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import FilledButton from "../../../common/components/buttons/FilledButton";
import GoogleButton from "../../../common/components/buttons/GoogleButton";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <div className="p-5">
      <div className="flex items-start gap-10 my-10">
        <div className="flex items-center flex-col gap-1">
          <button
            onClick={() => {
              navigate(RoutesPath.login);
            }}
            className="text-primary font-[700] text-xl"
          >
            Log In
          </button>
          <div className="bg-primary w-2 h-2 rounded-full" />
        </div>
        <button
          onClick={() => {
            navigate(RoutesPath.register);
          }}
          className="text-[#A9A9A9] font-[600] text-xl"
        >
          Sign Up
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* <FilledInput onchange={() => {}} placeholder="Username" /> */}
        <FilledInput onchange={() => {}} placeholder="Email" type="email" />
        <FilledInput
          onchange={(e) => {}}
          placeholder="Password"
          type="password"
          onPressSuffixIcon={() => setPasswordVisible((prev) => !prev)}
          suffixIcon={
            passwordVisible ? (
              <AiOutlineEyeInvisible color="#A9A9A9" size={25} />
            ) : (
              <Assets.Visible />
            )
          }
        />
        <div className="flex items-center my-10 gap-4">
          <input type="checkbox" className="acc accent-primary" name="" id="" />
          <div className="text-sm font-[800]">
            <span className="text-[#999797] ">I agree to the </span>
            <span className="text-primary underline"> Terms of Service </span>
            <span className="text-[#999797] "> and </span>
            <span className="text-primary underline"> Privacy Policy </span>
            <span className="text-[#999797] "> of Business Bosses </span>
          </div>
        </div>

        <div className="">
          <FilledButton
            onClick={() => {}}
            text="Sign Up"
            className="w-full p-3"
          />
        </div>
        <div className="flex items-center gap-2 my-5">
          <div className="bg-[#A9A9A999] h-[1px] w-full" />
          <p className="text-[#383838CC] font-[400]">or</p>
          <div className="bg-[#A9A9A999] h-[1px] w-full" />
        </div>
        <GoogleButton
          onClick={() => {}}
          text="Sign up with Google"
          className="w-full p-3"
        />
      </form>
    </div>
  );
};

export default LoginPage;
