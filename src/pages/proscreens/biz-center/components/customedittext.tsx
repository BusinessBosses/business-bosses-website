import React, { useState } from "react";
import { IconType } from "react-icons";
import {} from "react-icons/fi";
import Assets from "../../../../assets";

type CustomEditTextProps = {
  caption?: string;
  optionalText?: React.ReactNode;
  hintText: string;
  maxLength?: number;
  inputType?: React.HTMLInputTypeAttribute;
  isPassword?: boolean;
  value: string;
  onChange: (value: string) => void;
  backgroundColor?: string;
  isCurrencyField?: boolean;
  currencyFieldColor?: string;
  validator?: (value: string) => string | undefined;
  padding?: string | number;
  isPaymentField?: boolean;
  isOrder?: boolean;
  isSL?: boolean;
  isPS?: boolean;
  onTextChanged?: (value: string) => void;
  // Payment method fields
  pm1Value?: string;
  pm1Hint?: string;
  pm1OnChange?: (value: string) => void;
  pm2Value?: string;
  pm2Hint?: string;
  pm2OnChange?: (value: string) => void;
  pm3Value?: string;
  pm3Hint?: string;
  pm3OnChange?: (value: string) => void;
  pm4Value?: string;
  pm4Hint?: string;
  pm4OnChange?: (value: string) => void;
  pm5Value?: string;
  pm5Hint?: string;
  pm5OnChange?: (value: string) => void;
  // Currency field
  currencyValue?: string;
  currencyOnChange?: (value: string) => void;
};

const CustomEditText: React.FC<CustomEditTextProps> = ({
  caption = "",
  optionalText,
  hintText,
  maxLength,
  inputType = "text",
  isPassword = false,
  value,
  onChange,
  backgroundColor = "bg-white",
  isCurrencyField = false,
  currencyFieldColor = "bg-gray-100",
  validator,
  padding = "0px",
  isPaymentField = false,
  isOrder = false,
  isSL = false,
  isPS = false,
  onTextChanged,
  // Payment methods
  pm1Value,
  pm1Hint,
  pm1OnChange,
  pm2Value,
  pm2Hint,
  pm2OnChange,
  pm3Value,
  pm3Hint,
  pm3OnChange,
  pm4Value,
  pm4Hint,
  pm4OnChange,
  pm5Value,
  pm5Hint,
  pm5OnChange,
  // Currency
  currencyValue = "USD",
  currencyOnChange,
}) => {
  const [error, setError] = useState<string | undefined>();

  const updateQuantity = (newValue: number) => {
    if (newValue >= 1) {
      const valueStr = newValue.toString();
      onChange(valueStr);
      onTextChanged?.(valueStr);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (validator) {
      setError(validator(newValue));
    }
  };

  const renderInputField = () => {
    if (isCurrencyField) {
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-12">
            <input
              type="text"
              value={currencyValue}
              onChange={(e) => currencyOnChange?.(e.target.value)}
              className={`w-full h-full px-1 text-xs rounded ${currencyFieldColor}`}
              maxLength={3}
            />
          </div>
          {renderMainTextField()}
        </div>
      );
    }
    return renderMainTextField();
  };

  const renderMainTextField = () => {
    const commonProps = {
      className: "w-full text-sm outline-none bg-transparent",
      placeholder: hintText,
      value: value,
      onChange: handleChange,
      maxLength: maxLength,
    };

    if (maxLength && maxLength > 30) {
      return <textarea {...commonProps} rows={5} />;
    }

    return (
      <input {...commonProps} type={isPassword ? "password" : inputType} />
    );
  };

  const renderPaymentField = (
    value?: string,
    hint?: string,
    onChange?: (value: string) => void,
    icon?: React.ReactNode
  ) => {
    if (!hint || !onChange) return null;

    return (
      <div className="flex items-center gap-3 py-2">
        {isSL && icon && (
          <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
          className="w-full text-sm outline-none bg-transparent"
          maxLength={300}
        />
      </div>
    );
  };

  const renderPaymentFields = () => (
    <div className="mt-3 space-y-1">
      {pm1Hint &&
        renderPaymentField(
          pm1Value,
          pm1Hint,
          pm1OnChange,
          <Assets.igsl height={18} width={18} />
        )}
      {pm2Hint &&
        renderPaymentField(
          pm2Value,
          pm2Hint,
          pm2OnChange,
          <Assets.fbsl height={18} width={18} />
        )}
      {pm3Hint &&
        renderPaymentField(
          pm3Value,
          pm3Hint,
          pm3OnChange,
          <Assets.lsl height={18} width={18} />
        )}
      {pm4Hint &&
        renderPaymentField(
          pm4Value,
          pm4Hint,
          pm4OnChange,
          <Assets.xsl height={18} width={18} />
        )}
      {pm5Hint &&
        renderPaymentField(
          pm5Value,
          pm5Hint,
          pm5OnChange,
          <Assets.website height={18} width={18} />
        )}
    </div>
  );

  const paddingStyle = isPS
    ? { paddingRight: padding }
    : { paddingLeft: padding, paddingRight: padding };

  return (
    <div className={`${isPS ? "" : "px-4"}`} style={paddingStyle}>
      <div className={`rounded-lg ${backgroundColor} p-4`}>
        {isOrder ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold">{caption}</p>
            </div>
            <div className="flex-1 flex items-center">
              <button
                onClick={() => {
                  const currentValue = parseInt(value) || 0;
                  if (currentValue > 1) {
                    updateQuantity(currentValue - 1);
                  }
                }}
                className="p-1 rounded-full bg-gray-200"
              >
                {/* <FiMinus size={15} /> */}
              </button>
              <input
                type="number"
                value={value}
                onChange={(e) => {
                  const intValue = parseInt(e.target.value) || 0;
                  if (intValue >= 1) {
                    updateQuantity(intValue);
                  }
                }}
                className="flex-1 text-center text-sm outline-none mx-2"
                placeholder={hintText}
              />
              <button
                onClick={() => {
                  const currentValue = parseInt(value) || 0;
                  updateQuantity(currentValue + 1);
                }}
                className="p-1 rounded-full bg-gray-200"
              >
                {/* <FiPlus size={15} /> */}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {(caption || optionalText) && (
              <div className="flex items-center gap-2">
                {caption && <p className="text-sm font-semibold">{caption}</p>}
                {optionalText && (
                  <p className="text-sm text-gray-500 font-normal">{optionalText}</p>
                )}
              </div>
            )}
            {isPaymentField ? renderPaymentFields() : renderInputField()}
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomEditText;
