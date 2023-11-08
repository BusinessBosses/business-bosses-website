import { useRef, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import SegmentedControl from "../../../common/components/segmented_control/SegmentedControl";
import FilledButton from "../../../common/components/buttons/FilledButton";
import Assets from "../../../assets";
import SubscriptionController, {
  PaymentIntentStruct,
} from "../controller/SubscriptionController";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import { useAppSelector } from "../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";

interface Props {
  partnerData: PartnerData | null;
partnerDatatile: PartnerDatatile | null;
}
const SubscriptionPage: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const controlRef = useRef<HTMLDivElement>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const profile = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const prices: PaymentIntentStruct[] = [
    {
      plan: "monthly",
      price: "price_1NfNnDEGsMsi6baU9FbZf8dQ",
    },
    {
      plan: "annually",
      price: "price_1NfNnDEGsMsi6baUkDiWNJr7",
    },
  ];
  const handleSegmentChange = (value: string, index: number) => {
    setSelectedIndex(index);
  };

  const getMoneyText = () => {
    if (selectedIndex === 0) {
      return (
        <span className="text-md lg:text-base">
          Upgrade to a premium boss experience at only
          <span style={{ color: "red" }}> $9.99/month</span>
        </span>
      );
    } else {
      return (
        <span className="text-md lg:text-base">
          Upgrade to a premium boss experience at only{" "}
          <span style={{ color: "red" }}> $49.99/year</span>
        </span>
      );
    }
  };

  const createSubscriptionIntent = async () => {
    if (processing) return;

    setProcessing(true);

    const response = await SubscriptionController.createSubscriptionIntent(
      prices[selectedIndex]
    );
    if (response.success) {
      window.open(response.data, "_blank")?.focus();
    }else{

    }
    console.log(response);

    setProcessing(false);
  };

  return (
    <div>
      <div className=""

      >
        <div className="mobile-only">
          <div
            className="bg-white top-0 w-full z-50"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,


              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.02)",
            }}
          >

            <CommonPageHeader title="Become a premium member" />
          </div>
          <div className="" style={{
            textAlign: "center",
            height: "100vh",
            borderTop: '15px solid rgba(244, 244, 244, 1)',
            background: "linear-gradient(180deg, #CCDCEE 0%, #FFF 40%)",
          }}>
            <div className="p-5">
              <div className="mt-5 font-bold">{getMoneyText()}</div>
              <div className="">
                <SegmentedControl
                  segments={[
                    {
                      label: "Monthly",
                      ref: useRef<HTMLDivElement>(null),
                      value: "1",
                    },
                    {
                      label: "Annually",
                      ref: useRef<HTMLDivElement>(null),
                      value: "2",
                    },
                  ]}
                  controlRef={controlRef}
                  name=""
                  defaultIndex={selectedIndex}
                  callback={handleSegmentChange}
                />
              </div>

              <div
                className="px-8 py-10"
                style={{
                  borderRadius: "16px",
                  background: "",
                  boxShadow: "0px 0px 250px 0px rgba(0, 0, 0, 0.25)",
                  backdropFilter: "blur(5px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <div className="font-bold text-sm">What's included:</div>
                <div className="mt-5 items-center" style={{ display: "flex" }}>
                  <Assets.Checkmark height={22} />
                  <span className="text-sm" style={{ marginLeft: "8px" }}>Premium Badge</span>
                </div>
                <div className="items-center mt-4" style={{ display: "flex" }}>
                  <img src={Assets.Coin} alt="" />
                  <span className="text-sm" style={{ marginLeft: "8px" }}>Get 500 coins per month</span>
                </div>
                <div className="items-center mt-3" style={{ display: "flex" }}>
                  <img src={Assets.Rocket} alt="" />
                  <span className="text-sm" style={{ marginLeft: "8px" }}>
                    Boost post FREE with coins
                  </span>
                </div>
                <div className="text-sm items-center mt-3" style={{ display: "flex" }}>
                  <Assets.Moreconnections height={20} />
                  <span style={{ marginLeft: "8px" }}>
                    More connections & referrals
                  </span>
                </div>
                <div className="text-sm items-center mt-4" style={{ display: "flex" }}>
                  <Assets.Rankingicon height={20} />
                  <span className="text-sm" style={{ marginLeft: "8px" }}>
                    Rank higher on posts & listing
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <FilledButton
                  onClick={createSubscriptionIntent}
                  text={
                    // 'Continue'
                    processing
                      ? "Processing..."
                      : selectedIndex === 0
                        ? "Subscribe at $4.99"
                        : "Subscribe at $49.99"
                  }
                  className="w-full p-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="computer-only bg-[#fff]">
        <ComputerHeader partnerData={partnerData} partnerDatatile={partnerDatatile}   />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile.profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >
            <div className="computer-only">

              <CommonPageHeader title="Become a premium member" />
              <div className="" style={{
                textAlign: "center",
                height: "100vh",
                borderTop: '15px solid rgba(244, 244, 244, 1)',
                background: "linear-gradient(180deg, #CCDCEE 0%, #FFF 40%)",
              }}>
                <div className="p-5">
                  <div className="mt-5 font-bold">{getMoneyText()}</div>
                  <div className="">
                    <SegmentedControl
                      segments={[
                        {
                          label: "Monthly",
                          ref: useRef<HTMLDivElement>(null),
                          value: "1",
                        },
                        {
                          label: "Annually",
                          ref: useRef<HTMLDivElement>(null),
                          value: "2",
                        },
                      ]}
                      controlRef={controlRef}
                      name=""
                      defaultIndex={selectedIndex}
                      callback={handleSegmentChange}
                    />
                  </div>

                  <div
                    className="px-8 py-10"
                    style={{
                      borderRadius: "16px",
                      background: "",
                      boxShadow: "0px 0px 250px 0px rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(5px)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <div className="font-bold text-base">What's included:</div>
                    <div className="mt-5 items-center" style={{ display: "flex" }}>
                      <Assets.Checkmark />
                      <span className="text-base" style={{ marginLeft: "8px" }}>Premium Badge</span>
                    </div>
                    <div className="items-center mt-4" style={{ display: "flex" }}>
                      <img src={Assets.Coin} alt="" />
                      <span className="text-base" style={{ marginLeft: "8px" }}>Get 500 coins per month</span>
                    </div>
                    <div className="items-center mt-3" style={{ display: "flex" }}>
                      <img src={Assets.Rocket} alt="" />
                      <span className="text-base" style={{ marginLeft: "8px" }}>
                        Boost post FREE with coins
                      </span>
                    </div>
                    <div className="text-sm items-center mt-3" style={{ display: "flex" }}>
                      <Assets.Moreconnections height={20} />
                      <span className="text-base" style={{ marginLeft: "8px" }}>
                        More connections & referrals
                      </span>
                    </div>
                    <div className="text-sm items-center mt-4" style={{ display: "flex" }}>
                      <Assets.Rankingicon height={20} />
                      <span className="text-base" style={{ marginLeft: "8px" }}>
                        Rank higher on posts & listing
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <FilledButton
                      onClick={createSubscriptionIntent}
                      text={
                        // 'Continue'
                        processing
                          ? "Processing..."
                          : selectedIndex === 0
                            ? "Subscribe at $4.99"
                            : "Subscribe at $49.99"
                      }
                      className="w-full p-3"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} partnerData={partnerData}   partnerDatatile={partnerDatatile} />
              ) : null}
            </div>
          </div>
        </div>
      </div>








    </div>
  );
};
export default SubscriptionPage;
