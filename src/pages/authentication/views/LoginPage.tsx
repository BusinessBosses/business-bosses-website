import { useRef, useState } from "react";
import FilledInput from "../../../common/components/inputs/FilledInput";
import Assets from "../../../assets";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import FilledButton from "../../../common/components/buttons/FilledButton";
import GoogleButton from "../../../common/components/buttons/GoogleButton";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import AuthController from "../controller/AuthController";
import { StorageEnum } from "../../../common/emums/StorageEmuns";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
interface Props {
  onLoginSuccess: VoidFunction;
}
const LoginPage = ({ onLoginSuccess }: Props) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const googleLogin = useGoogleLogin({
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
            onLoginSuccess();
            navigate(RoutesPath.home);
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

  const login = async () => {
    if (loading) return;
    const validate = AuthController.validateLogin({
      email: emailRef.current?.value.trim(),
      password: passwordRef.current?.value.trim(),
      terms: termsRef.current?.checked,
    });
    if (validate) {
      setLoading(true);
      const response = await AuthController.loginRequest({
        email: emailRef.current?.value.trim(),
        password: passwordRef.current?.value.trim(),
      });
      if (response.success) {
        localStorage.setItem(
          StorageEnum.AccessToken,
          response.data.accessToken
        );
        localStorage.setItem(StorageEnum.UserId, response.data.uid);
        onLoginSuccess();
        navigate(RoutesPath.home);
      }

      setLoading(false);
    }
  };
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
            className="acc accent-primary"
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
            onClick={() => {
              if (loading) return;
              login();
            }}
            text={loading ? "Authenticating..." : "Sign Up"}
            className="w-full p-3"
          />
        </div>
        <div className="flex items-center gap-2 my-5">
          <div className="bg-[#A9A9A999] h-[1px] w-full" />
          <p className="text-[#383838CC] font-[400]">or</p>
          <div className="bg-[#A9A9A999] h-[1px] w-full" />
        </div>

        <GoogleButton
          onClick={googleLogin}
          text="Sign up with Google"
          className="w-full p-3"
        />
      </form>
    </div>
  );
};

export default LoginPage;
