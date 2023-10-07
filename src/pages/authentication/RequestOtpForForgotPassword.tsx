import FilledInput from "../../common/components/inputs/FilledInput";
import FilledButton from "../../common/components/buttons/FilledButton";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../constants/Routes";
import AuthController from "./controller/AuthController";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";

const RequestOtpForForgotPassword = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const onSubmit = async () => {
    if (!!!emailRef.current?.value.trim()) return;
    if (loading) return;
    setLoading(true);
    const response = await AuthController.requestOpt(
      emailRef.current.value.trim()
    );
    if (response.success) {
      navigate(RoutesPath.verifyOtp, {
        state: {
          email: emailRef.current.value.trim(),
          isForgotPassword: true,
        },
      });
    }
    setLoading(false);
  };
  return (
    <div className="w-full min-h-screen h-full bg-white">
      <CommonPageHeader title={"Forgot Password"} />
      <div className="p-5 lg:px-80 w-full justify-center">
        <div className="pb-10"
          style={{
            textAlign: 'center',
            fontWeight: '900',
            fontSize: 28,
            color: 'red',
          }}
        >
          Business
          <br />
          Bosses
        </div>

        <p className="text-[#383838cc] text-s text-start font-bold">
          Enter your email for the verification process, we'll send you a reset
          password email.
        </p>
        <FilledInput
          inputRef={emailRef}
          onchange={() => { }}
          type="email"
          label="Email Address"
          placeholder="example@gmail.com"
        />

        <FilledButton
          onClick={onSubmit}
          text={loading ? "Authenticating..." : "Continue"}
          className="p-3 w-full"
        />
      </div>
    </div>
  );
};

export default RequestOtpForForgotPassword;
