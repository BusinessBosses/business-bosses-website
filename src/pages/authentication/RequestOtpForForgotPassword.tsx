import FilledInput from "../../common/components/inputs/FilledInput";
import FilledButton from "../../common/components/buttons/FilledButton";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../constants/Routes";
import AuthController from "./controller/AuthController";

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
    <div className="w-full min-h-screen h-full flex p-5 justify-center flex-col">
      <p className="text-[#383838cc] text-sm">
        Enter your email for the verification process, we'll send you a reset
        password email.
      </p>
      <FilledInput
        inputRef={emailRef}
        onchange={() => {}}
        type="email"
        label="Email Address"
        placeholder="exapmle@gmail.com"
      />
      <FilledButton
        onClick={onSubmit}
        text={loading ? "Authenticating..." : "Continue"}
        className="p-3"
      />
    </div>
  );
};

export default RequestOtpForForgotPassword;
