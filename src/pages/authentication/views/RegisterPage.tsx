import { useRef, useState } from "react";
import FilledButton from "../../../common/components/buttons/FilledButton";
import GoogleButton from "../../../common/components/buttons/GoogleButton";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import Assets from "../../../assets";
import FilledInput from "../../../common/components/inputs/FilledInput";
import RoutesPath from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import AuthController from "../controller/AuthController";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import { StorageEnum } from "../../../common/emums/StorageEmuns";
interface Props {
  onSuccess: VoidFunction;
}
const RegisterPage = ({ onSuccess }: Props) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const googleAuth = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        setLoading(true);
        const user = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${credentialResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );
        if (user.data.id) {
          const response = await AuthController.googleLoginRequest({
            email: user.data.email,
            token: credentialResponse.access_token,
          });
          if (response.success) {
            localStorage.setItem(
              StorageEnum.AccessToken,
              response.data.accessToken
            );
            localStorage.setItem(StorageEnum.UserId, response.data.uid);
            onSuccess();
            navigate(RoutesPath.editProfile, { state: response.data });
          }
        }
        setLoading(false);
      } catch (error) {
        toast.error("Something went Wrong!");
      }
    },
    onError: () => {
      toast.error("OOPS!! Something went wrong");
    },
  });

  const register = async () => {
    if (loading) return;
    const username = usernameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    const validate = AuthController.validateRegister({
      username,
      email,
      password,
      terms: termsRef.current?.checked,
    });
    if (validate) {
      setLoading(true);
      const response = await AuthController.registerRequest({
        username,
        email,
        password,
      });
      if (response.success) {
        navigate(RoutesPath.verifyOtp, { state: email });
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-start gap-10 my-10">
        <button
          onClick={() => {
            navigate(RoutesPath.login);
          }}
          className="text-[#A9A9A9] font-[600] text-xl"
        >
          Login
        </button>
        <div className="flex items-center flex-col gap-1">
          <button
            onClick={() => {
              navigate(RoutesPath.register);
            }}
            className="text-primary font-[700] text-xl"
          >
            Sign Up
          </button>
          <div className="bg-primary w-2 h-2 rounded-full" />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FilledInput
          inputRef={usernameRef}
          onchange={() => {}}
          placeholder="Username"
        />
        <FilledInput
          inputRef={emailRef}
          onchange={() => {}}
          placeholder="Email"
          type="email"
        />
        <FilledInput
          inputRef={passwordRef}
          onchange={(e) => {}}
          placeholder="Password"
          type={passwordVisible ? "text" : "password"}
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
          <input
            defaultChecked
            ref={termsRef}
            type="checkbox"
            className="accent-primary"
            name=""
            id=""
          />
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
            onClick={register}
            text={loading ? "Authenticating" : "Sign Up"}
            className="w-full p-3"
          />
        </div>
        <div className="flex items-center gap-2 my-5">
          <div className="bg-[#A9A9A999] h-[1px] w-full" />
          <p className="text-[#383838CC] font-[400]">or</p>
          <div className="bg-[#A9A9A999] h-[1px] w-full" />
        </div>
        <GoogleButton
          onClick={() => {
            if (loading) return;
            googleAuth();
          }}
          text="Sign in with Google"
          className="w-full p-3"
        />
      </form>
    </div>
  );
};

export default RegisterPage;
