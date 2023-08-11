import PinInput from "react-pin-input";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { useLocation, useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useEffect, useRef, useState } from "react";
import AuthController from "../controller/AuthController";
import { StorageEnum } from "../../../common/emums/StorageEmuns";
import FilledInput from "../../../common/components/inputs/FilledInput";
import Popup from "reactjs-popup";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
interface Props {
  onSuccess: VoidFunction;
}
const OtpVerificationPage = ({ onSuccess }: Props) => {
  const [pin, setPin] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState<
    boolean
  >(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const verify = async () => {
    if (loading) return;
    const validate = AuthController.validateOTPVerification(pin);
    if (validate) {
      setLoading(true);
      if (isForgotPassword) {
        const response = await AuthController.verifyEmail({
          otp: pin,
          email,
        });
        if (response.success) {
          localStorage.setItem(
            StorageEnum.AccessToken,
            response.data.accessToken
          );
          localStorage.setItem(StorageEnum.UserId, response.data.uid);
          setLoading(false);

          setOpenResetPasswordDialog(true);
          return;
        }
      } else {
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
      }
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!!!newPasswordRef.current?.value.trim()) return;
    if (loading) return;
    setLoading(true);
    const response = await AuthController.resetPassword(
      email,
      newPasswordRef.current.value.trim()
    );
    if (response.success) {
      onSuccess();
      if (response.data.bio) {
        navigate(RoutesPath.home);
        return;
      } else {
        navigate(RoutesPath.editProfile, { state: response.data });
        return;
      }
    }
  };

  useEffect(() => {
    const state = location.state;
    if (!state) {
      navigate(-1);
    } else {
      setEmail(state.email);
      setIsForgotPassword(state.isForgotPassword);
    }
  }, []);
  return (
    <div>
      <CommonPageHeader title={"Code Verification"} />
      <div className="p-5 bg-white" style={{ height: "100vh" }}>

        <Popup
          closeOnDocumentClick={false}
          closeOnEscape={false}
          overlayStyle={{
            backdropFilter: "blur(5px)",
            background: "rgba(0,0,0,.5)",
          }}
          modal
          open={openResetPasswordDialog}
        >
          <div className="flex justify-center px-3">
            <div className=" bg-white p-5 rounded-lg xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-full xs:w-full ">
              <div className="">
                <h1 className="text-2xl mb-5">Reset Password</h1>
                <small className="text-sm text-black-80">
                  Reset Password For {email}
                </small>
                {/* <br /> */}
                <div className="">
                  <FilledInput
                    inputRef={newPasswordRef}
                    label="Set New Password"
                    placeholder="input password"
                    onchange={() => { }}
                  />
                  <FilledButton
                    onClick={resetPassword}
                    text={loading ? "Processing..." : "Reset Password"}
                    className="w-full p-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </Popup>
        <div className="">
          <h1 className="text-primary text-3xl my-10 font-[800] text-center">
            Business <br/> Bosses
          </h1>
          <p className="text-[#6D6D73] text-center">
            Enter the 6 digits code that you received on your email so you can
            continue your account creation.
          </p>
        </div>

        <div className="my-10 text-center">
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
            onComplete={(value, index) => { }}
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
    </div>
  );
};

export default OtpVerificationPage;
