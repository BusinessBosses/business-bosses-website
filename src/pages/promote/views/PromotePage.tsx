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
        <div style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff', borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)' }}>
        <CommonPageHeader title="Boost Post" />
      </div>
      <div className="my-20"></div>

      <Banner />
      <div className="p-5">
        <h2 className="text-2xl font-bold">Choose your plan</h2>

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

        <FilledButton
          onClick={() => {
            if (loading) return;
            createPaymentIntent(currentPlan * 100);
          }}
          text={loading ? "Processing" : "Continue"}
          className="w-full py-3"
        />
      </div>
    </div>
  );
};

export default PromotePage;
