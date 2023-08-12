import { useRef, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import SegmentedControl from "../../../common/components/segmented_control/SegmentedControl";
import FilledButton from "../../../common/components/buttons/FilledButton";
import Assets from "../../../assets";
import SubscriptionController, {
  PaymentIntentStruct,
} from "../controller/SubscriptionController";
import ComputerHeader from "../../home/views/components/ComputerHeader";

const SubscriptionPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const controlRef = useRef<HTMLDivElement>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const prices: PaymentIntentStruct[] = [
    {
      plan: "monthly",
      price: "price_1NIrQiEGsMsi6baUybHKB3X5",
    },
    {
      plan: "annually",
      price: "price_1NIrQiEGsMsi6baUpmQjfsrp",
    },
  ];
  const handleSegmentChange = (value: string, index: number) => {
    setSelectedIndex(index);
  };

  const getMoneyText = () => {
    if (selectedIndex === 0) {
      return (
        <span className="text-md">
          Upgrade to a premium boss experience at only
          <span style={{ color: "red" }}> $9.99/month</span>
        </span>
      );
    } else {
      return (
        <span>
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
    }

    setProcessing(false);
  };

  return (
    <div>
    <div className="mobile-only"
      style={{
        textAlign: "center",
        height: "100vh",
        background: "linear-gradient(180deg, #CCDCEE -90%, #FFF 100%)",
      }}
    >
      <div className="mobile-only">
        <div
          className="bg-white top-0 w-full z-50"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: "10px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.02)",
          }}
        >
          <CommonPageHeader title="Become a Premium Member" />
        </div>
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
              <span className="text-sm"style={{ marginLeft: "8px" }}>Premium Badge</span>
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
              <Assets.Moreconnections height={20}/>
              <span style={{ marginLeft: "8px" }}>
                More connections & referrals
              </span>
            </div>
            <div className="text-sm items-center mt-4"style={{ display: "flex" }}>
              <Assets.Rankingicon height={20}/>
              <span className="text-sm" style={{ marginLeft: "8px" }}>
                Rank higher on posts & listing
              </span>
            </div>
          </div>

          <div className="mt-5">
            <FilledButton
              onClick={createSubscriptionIntent}
              text={
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



    <div className="computer-only">
      <ComputerHeader/>

    </div>








    </div>
  );
};
export default SubscriptionPage;
