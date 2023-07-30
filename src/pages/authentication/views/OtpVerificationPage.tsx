import PinInput from "react-pin-input";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { useLocation, useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useEffect, useState } from "react";
import AuthController from "../controller/AuthController";
import { StorageEnum } from "../../../common/emums/StorageEmuns";
interface Props {
  onSuccess: VoidFunction;
}
const OtpVerificationPage = ({ onSuccess }: Props) => {
  const [pin, setPin] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const verify = async () => {
    if (loading) return;
    const validate = AuthController.validateOTPVerification(pin);
    if (validate) {
      setLoading(true);
      const response = await AuthController.verificationRequest({
        otp: pin,
        email,
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
      setLoading(false);
    }
  };

  useEffect(() => {
    const state = location.state;
    if (!state) {
      navigate(-1);
    } else {
      setEmail(state);
    }
  }, []);
  return (
    <div className="p-5">
      <div className="">
        <h1 className="text-primary text-3xl my-10 font-[800] text-center">
          Business Bosses
        </h1>
        <p className="text-[#6D6D73] text-center">
          Enter the 6 digits code that you received on your email so you can
          continue your account creation.
        </p>
      </div>

      <div className="my-10">
        <PinInput
          length={6}
          initialValue=""
          secret
          secretDelay={100}
          onChange={(value, index) => {
            setPin(value);
          }}
          type="numeric"
          inputMode="number"
          style={{ padding: "5px", border: "none" }}
          inputStyle={{
            background: "#F4F4F4",
            border: "none",
            borderRadius: "10px",
          }}
          inputFocusStyle={{ border: "1px solid #F21C29" }}
          onComplete={(value, index) => {}}
          autoSelect={true}
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        />
      </div>

      <FilledButton
        className="w-full p-3"
        onClick={verify}
        text={loading ? "Verifying..." : "Verify"}
      />
    </div>
  );
};

export default OtpVerificationPage;
