import { useRef, useState } from "react";
import FilledInput from "../../../common/components/inputs/FilledInput";
import Assets from "../../../assets";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import FilledButton from "../../../common/components/buttons/FilledButton";
import GoogleButton from "../../../common/components/buttons/GoogleButton";
import { useLocation, useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import AuthController from "../controller/AuthController";
import { StorageEnum } from "../../../common/emums/StorageEmuns";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import ReactPlayer from "react-player";
interface Props {
  onLoginSuccess: VoidFunction;
}
const LoginPage = ({ onLoginSuccess }: Props) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const emailReff = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordReff = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const termsReff = useRef<HTMLInputElement>(null);
  const location = useLocation();
  console.log('login location.state =', location.state);
  const from = (location.state as any)?.from?.pathname || RoutesPath.home;

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
            localStorage.setItem("hasLoggedInBefore", "true");
            onLoginSuccess();
            navigate(from, { replace: true });
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

  const googleLoginn = useGoogleLogin({
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
            localStorage.setItem("hasLoggedInBefore", "true");
            onLoginSuccess();
            navigate(from, { replace: true });
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
        localStorage.setItem("hasLoggedInBefore", "true");
        onLoginSuccess();
        navigate(from, { replace: true });
      }

      setLoading(false);
    }
  };

  const loginn = async () => {
    if (loading) return;
    const validate = AuthController.validateLogin({
      email: emailReff.current?.value.trim(),
      password: passwordReff.current?.value.trim(),
      terms: termsReff.current?.checked,
    });
    if (validate) {
      setLoading(true);
      const response = await AuthController.loginRequest({
        email: emailReff.current?.value.trim(),
        password: passwordReff.current?.value.trim(),
      });
      if (response.success) {
        localStorage.setItem(
          StorageEnum.AccessToken,
          response.data.accessToken
        );
        localStorage.setItem(StorageEnum.UserId, response.data.uid);
        localStorage.setItem("hasLoggedInBefore", "true");
        onLoginSuccess();
        navigate(from, { replace: true });
      }

      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 mobile-only bg-white">
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
            inputRef={emailReff}
            onchange={() => {}}
            placeholder="Email"
            type="email"
          />
          <FilledInput
            inputRef={passwordReff}
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
          <div className="flex items-center justify-end pb-10">
            <button
              type="button"
              onClick={() => {
                navigate(RoutesPath.forgotPassword);
              }}
              className="underline text-sm"
            >
              Forgot Password?
            </button>
          </div>

          <div className="">
            <FilledButton
              onClick={loginn}
              text={loading ? "Authenticating..." : "Sign in"}
              className="w-full p-3"
            />
          </div>
          <div className="flex items-center gap-2 my-5">
            <div className="bg-[#A9A9A999] h-[1px] w-full" />
            <p className="text-[#383838CC] font-[400]">or</p>
            <div className="bg-[#A9A9A999] h-[1px] w-full" />
          </div>

          <GoogleButton
            onClick={googleLoginn}
            text="Sign in with Google"
            className="w-full p-3"
          />
        </form>

        <div className="px-5 pb-3">
          <div
            className="mt-3 gap-2"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "55%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Assets.Appstorelogo
                onClick={() =>
                  (window.location.href =
                    "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")
                }
              />
            </div>
            <div
              style={{
                width: "55%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Assets.Playstorelogo
                onClick={() =>
                  (window.location.href =
                    "https://play.google.com/store/search?q=Business%20bosses&c=apps")
                }
              />
            </div>
          </div>
        </div>

        <div
          className="text-[#333333] mb-10 text-sm lg:text-base"
          style={{ textAlign: "center" }}
        >
          No.1 App to Start,
          <br />
          Grow And Promote Your Business.
        </div>

        <div
          className=""
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            height: "60vh",
            width: "100%",
          }}
        >
          <ReactPlayer
            url="https://youtu.be/3gm6eBtWfi4"
            controls
            width="100%"
            height="100%"
          />
        </div>

        <div
          className="p-5 flex items-center justify-center"
          style={{
            width: "100%",
            height: "40vh",
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderRadius: "20px",
            border: "1px solid white",
            backdropFilter: "blur(1px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="">
            <img src={Assets.Logo} className="w-10 h-10" alt="" />
          </div>
          <div className=" text-[#232324] font-[600] text-md pl-3">
            Business Bosses
          </div>
        </div>
      </div>

      <div className="computer-only">
        <div className="flex">
          <div
            className="authlastsection bg-[#F4F4F4] w-full h-screen flex flex-col justify-center items-center lg:p-10 md:p-5 1xl:p-20 xl:p-20 2xl:p-20"
            style={{}}
          >
            <div
              className=""
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                height: "60vh",
                width: "100%",
              }}
            >
              <ReactPlayer
                url="https://youtu.be/3gm6eBtWfi4"
                controls
                width="100%"
                height="100%"
              />
            </div>

            <div
              className="p-5 mt-5"
              style={{
                width: "100%",
                height: "40vh",
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderRadius: "20px",
                border: "1px solid white",
                backdropFilter: "blur(1px)",
                WebkitBackdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="">
                <img src={Assets.Logo} className="w-20 h-20" alt="" />
              </div>
              <div className="mb-3 text-[#232324] font-[600] text-xl pl-3">
                Business Bosses
              </div>
              <div className="text-[#333333]" style={{ textAlign: "center" }}>
                No.1 App to Start, Grow And Promote Your Business.
              </div>
              <div className="text-[#333333]" style={{ textAlign: "center" }}>
                Join Now for free & Unlock Your Potential
              </div>
              <div
                className="mt-3"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="pr-2">
                  <Assets.Appstorelogo
                    onClick={() =>
                      (window.location.href =
                        "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")
                    }
                  />
                </div>
                <div>
                  <Assets.Playstorelogo
                    onClick={() =>
                      (window.location.href =
                        "https://play.google.com/store/search?q=Business%20bosses&c=apps")
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="authfirstsection 1xl:p-40 2xl:p-40 xl:p-20 lg:p-10 md:p-5">
            <div className="flex items-center">
              <img
                src={Assets.Logo}
                className="w-12 h-12 my-3 cursor-pointer"
                alt=""
                onClick={() => {}}
              />
              <div className="text-[#232324] font-[600] text-xl pl-3">
                Business Bosses
              </div>
            </div>

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
              <div className="flex items-center justify-end pb-10">
                <button
                  type="button"
                  onClick={() => {
                    navigate(RoutesPath.forgotPassword);
                  }}
                  className="underline text-sm"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="">
                <FilledButton
                  onClick={login}
                  text={loading ? "Authenticating..." : "Sign in"}
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
                text="Sign in with Google"
                className="w-full p-3"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
