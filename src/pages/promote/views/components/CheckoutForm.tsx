import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { toast } from "react-toastify";
interface Props {
  onSuccess: VoidFunction;
  onError: VoidFunction;
}
const CheckoutForm = ({ onError, onSuccess }: Props) => {
  const stripe = useStripe();
  const [loading, setLoading] = useState<boolean>(false);
  const elements = useElements();
  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setLoading(true);
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: "if_required",
      //   confirmParams: {
      //     return_url: `${window.location.origin}`,
      //   },
    });

    if (result.error) {
      toast.error(result.error.message);
      onError();
      // Show error to your customer (for example, payment details incomplete)
    } else {
      toast.success("Payment Successful");
      onSuccess();
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        className="w-full text-white bg-primary mt-10 rounded-lg p-3"
        disabled={!stripe || loading}
      >
        {!loading ? "Pay" : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutForm;
