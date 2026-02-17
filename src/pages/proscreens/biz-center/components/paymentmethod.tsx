import React, { useState } from "react";
import CustomEditText from "./customedittext";

interface PaymentMethodProps {
  onSelectionChange: (selections: Record<string, boolean>) => void;
  onComplete: (details: {
    bankDetails: Record<string, string>;
    paypalDetails: Record<string, string>;
    walletDetails: Record<string, string>;
  }) => void;
  backgroundColor?: string; // Add background color prop
}

const PaymentMethodSelector: React.FC<PaymentMethodProps> = ({
  onSelectionChange,
  onComplete,
  backgroundColor = "bg-gray-100", // Default to light grey
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState<Record<string, boolean>>({
    Bank: false,
    Paypal: false,
    Wallet: false,
    Cash: false,
  });

  const [bankDetails, setBankDetails] = useState({
    fullName: "",
    country: "",
    bankName: "",
    accountNumber: "",
  });

  const [paypalDetails, setPaypalDetails] = useState({
    fullName: "",
    email: "",
  });

  const [walletDetails, setWalletDetails] = useState({
    fullName: "",
    walletInfo: "",
  });

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectionChange = (option: string) => {
    const newSelections = {
      ...selections,
      [option]: !selections[option],
    };
    setSelections(newSelections);
    onSelectionChange(newSelections);
  };

  const handleComplete = () => {
    onComplete({
      bankDetails,
      paypalDetails,
      walletDetails,
    });
    setIsOpen(false);
  };

  const selectedOptionsText =
    Object.entries(selections)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(", ") || "Select Payment Method";

  return (
    <div className="w-full space-y-4">
      <div
        className={`w-full p-4 ${backgroundColor} rounded-lg flex justify-between items-end cursor-pointer`}
        onClick={toggleDropdown}
      >
        <div className="flex flex-col items-start justify-end">
          <span className="text-sm font-semibold">Payment Method *</span>
          <span className="text-sm font-normal pt-2">
            {selectedOptionsText}
          </span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className={`space-y-4 ${backgroundColor} p-4 border rounded-lg`}>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Payment Methods</h3>

            <div className="grid grid-cols-2 gap-4">
              {["Bank", "Paypal", "Wallet", "Cash"].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option}
                    checked={selections[option] || false}
                    onChange={() => handleSelectionChange(option)}
                    className="h-4 w-4 text-sm text-black focus:black border-gray-300 rounded"
                  />
                  <label
                    htmlFor={option}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {selections.Bank && (
              <div className="space-y-2">
                <CustomEditText
                  isPaymentField={true}
                  caption="Enter Bank Details"
                  hintText="Enter account information here"
                  pm1Hint="Full Name"
                  pm2Hint="Country"
                  pm3Hint="Bank Name"
                  pm4Hint="Account Number"
                  maxLength={300}
                  backgroundColor="bg-white"
                  padding="0px"
                  pm1Value={bankDetails.fullName}
                  pm2Value={bankDetails.country}
                  pm3Value={bankDetails.bankName}
                  pm4Value={bankDetails.accountNumber}
                  pm1OnChange={(value) =>
                    setBankDetails({ ...bankDetails, fullName: value })
                  }
                  pm2OnChange={(value) =>
                    setBankDetails({ ...bankDetails, country: value })
                  }
                  pm3OnChange={(value) =>
                    setBankDetails({ ...bankDetails, bankName: value })
                  }
                  pm4OnChange={(value) =>
                    setBankDetails({ ...bankDetails, accountNumber: value })
                  }
                  onChange={() => {}}
                  value=""
                />
              </div>
            )}

            {selections.Paypal && (
              <div className="space-y-2">
                <CustomEditText
                  isPaymentField={true}
                  caption="Enter Paypal Details"
                  hintText="Enter account information here"
                  pm1Hint="Full Name"
                  pm2Hint="Paypal Email Address"
                  maxLength={300}
                  backgroundColor="bg-white"
                  padding="0px"
                  pm1Value={paypalDetails.fullName}
                  pm2Value={paypalDetails.email}
                  pm1OnChange={(value) =>
                    setPaypalDetails({ ...paypalDetails, fullName: value })
                  }
                  pm2OnChange={(value) =>
                    setPaypalDetails({ ...paypalDetails, email: value })
                  }
                  onChange={() => {}}
                  value=""
                />
              </div>
            )}

            {selections.Wallet && (
              <div className="space-y-2">
                <CustomEditText
                  isPaymentField={true}
                  caption="Enter Wallet Details"
                  hintText="Enter account information here"
                  pm1Hint="Full Name"
                  pm2Hint="Wallet Email Address or Wallet Number"
                  maxLength={300}
                  backgroundColor="bg-white"
                  padding="0px"
                  pm1Value={walletDetails.fullName}
                  pm2Value={walletDetails.walletInfo}
                  pm1OnChange={(value) =>
                    setWalletDetails({ ...walletDetails, fullName: value })
                  }
                  pm2OnChange={(value) =>
                    setWalletDetails({ ...walletDetails, walletInfo: value })
                  }
                  onChange={() => {}}
                  value=""
                />
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            onClick={handleComplete}
          >
            Save Payment Methods
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
