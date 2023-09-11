import { useEffect, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Plan from "./components/Plan";
import Banner from "./components/Banner";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";
import serviceApi from "../../../services/serviceApi";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { Post } from "../../../common/interfaces/post";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePost } from "../../../redux/slices/PostSlice";
import RoutesPath from "../../../constants/Routes";
import FilledButtonsmall from "../../../common/components/buttons/FilledButtonsmall";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";

export interface PlanInterface {
  amount: number;
  duration: string;
  reach: string;
}

const PromotePage = () => {
  const [openPaymentElement, setOpenPaymentElement] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const posts = useAppSelector((state) => state.post.mixedPosts);
  const dispatch = useAppDispatch();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();
  const [isCoin, setIsCoin] = useState(false);
  const profile = useAppSelector((state) => state.user);
  const getConfig = async () => {
    const response = await serviceApi.fetch("/payment/config");
    if (response.publishableKey) {
      setStripePromise(loadStripe(response.publishableKey));
    }
  };
  useEffect(() => {
    const state = location.state;
    if (!state) {
      navigate(-1);
    } else {
      setPostId(state);
      getConfig();
    }
  }, []);

  const createPaymentIntent = async (amount: number) => {
    setLoading(true);
    const response = await serviceApi.post("/payment/create-payment-intent", {
      amount,
    });
    if (response.success) {
      setClientSecret(response.clientSecret);
      if (stripePromise) {
        setOpenPaymentElement(true);
      }
    }
    setLoading(false);
  };

  const plans: PlanInterface[] = [
    {
      amount: 3,
      duration: "Duration 3 days",
      reach: "Reach 500 to 850 people",
    },
    {
      amount: 5,
      duration: "Duration 5 Days",
      reach: "Reach 900 to 1.2k people",
    },
  ];

  const [currentPlan, setCurrentPlan] = useState<number>(plans[0].amount);
  function isPost(obj: any): obj is Post {
    return "postId" in obj;
  }
  const updatePostFn = async () => {
    const postIndex = posts.findIndex(
      (fd) => isPost(fd.data) && fd.data.postId === postId
    );
    if (postIndex !== -1) {
      dispatch(
        updatePost({
          index: postIndex,
          post: {
            ...posts[postIndex],
            data: {
              ...posts[postIndex].data,
              promote: true,
            } as Post,
          },
        })
      );
    }
    navigate(RoutesPath.home);
    await serviceApi.update(`/post/update-post/${postId}`, {
      promote: true,
      plan: `${currentPlan} dollars`,
    });
  };

  return (
    <div>
      <div className="mobile-only">
        <div className="bg-white" style={{ height: '100vh' }}>
          <div
            className="bg-white top-0 w-full z-50 "
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
            }}
          >
            <div className="mobile-only bg-white">
              <CommonPageHeader title="Boost Post" />
            </div>
          </div>

          <Banner />
          <div className="p-5">
            <div className='pb-2 text-md font-bold'>Choose your Plan</div>

            {plans.map((plan, index) => {
              return (
                <Plan
                  onChangePlan={() => setCurrentPlan(plan.amount)}
                  plan={plan}
                  active={currentPlan === plan.amount}
                  key={index}
                />
              );
            })}

            <BottomSheet
              onDismiss={() => setOpenPaymentElement(false)}
              scrollLocking
              open={openPaymentElement}
            >
              <div className="p-5 mb-10">
                {stripePromise && clientSecret ? (
                  <Elements
                    stripe={stripePromise!}
                    options={{ clientSecret: clientSecret }}
                  >
                    <CheckoutForm
                      onError={() => {
                        setOpenPaymentElement(false);
                      }}
                      onSuccess={() => {
                        setOpenPaymentElement(false);
                        updatePostFn();
                      }}
                    />
                  </Elements>
                ) : null}
              </div>
            </BottomSheet>
            <div className='py-2'>

              {/* Pay With Coin */}
              <div>
                <div className='flex pb-2' style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isCoin}
                    onChange={(e) => setIsCoin(e.target.checked)}
                  />
                  <div className='pl-3  text-sm'>Pay With Coin (100 Coins = $1)</div>
                </div>
                <div></div>
              </div>

              <FilledButtonsmall
                onClick={() => {
                  if (loading) return;
                  createPaymentIntent(currentPlan * 100);
                }}
                text={loading ? "Processing" : "Continue"}
                className="w-full mt-3 py-3"
              /></div>
          </div>
        </div>


      </div>


      <div className='computer-only'>
        <ComputerHeader />

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
            <div className="">
        <div className="bg-white" style={{ height: '100vh' }}>
         
            <div className="bg-white">
              <CommonPageHeader title="Boost Post" />
            </div>
          

          <Banner />
          <div className="p-5">
            <div className='pb-2 text-base font-bold'>Choose your Plan</div>

            {plans.map((plan, index) => {
              return (
                <Plan
                  onChangePlan={() => setCurrentPlan(plan.amount)}
                  plan={plan}
                  active={currentPlan === plan.amount}
                  key={index}
                />
              );
            })}

            <BottomSheet
              onDismiss={() => setOpenPaymentElement(false)}
              scrollLocking
              open={openPaymentElement}
            >
              <div className="p-5 mb-10">
                {stripePromise && clientSecret ? (
                  <Elements
                    stripe={stripePromise!}
                    options={{ clientSecret: clientSecret }}
                  >
                    <CheckoutForm
                      onError={() => {
                        setOpenPaymentElement(false);
                      }}
                      onSuccess={() => {
                        setOpenPaymentElement(false);
                        updatePostFn();
                      }}
                    />
                  </Elements>
                ) : null}
              </div>
            </BottomSheet>
            <div className='py-5'>

              {/* Pay With Coin */}
              <div>
                <div className='flex pb-5' style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isCoin}
                    onChange={(e) => setIsCoin(e.target.checked)}
                  />
                  <div className='pl-3  text-sm'>Pay With Coin (100 Coins = $1)</div>
                </div>
                <div></div>
              </div>

              <FilledButtonsmall
                onClick={() => {
                  if (loading) return;
                  createPaymentIntent(currentPlan * 100);
                }}
                text={loading ? "Processing" : "Continue"}
                className="w-full mt-3 py-3"
              /></div>
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
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
              ) : null}
            </div>
          </div>
        </div>
      </div>



    </div>
  );
};

export default PromotePage;
