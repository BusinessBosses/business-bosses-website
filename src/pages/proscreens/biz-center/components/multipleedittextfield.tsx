import React, { useState, useEffect, useRef } from "react";
import { FiMinus } from "react-icons/fi";

interface MultipleEditTextProps {
  caption: string;
  hintText: string;
  initialValues?: string[];
  padding?: string;
  buttonSize?: number;
  backgroundColor?: string;
  onValuesChanged?: (values: string[]) => void;
}

const MultipleEditText: React.FC<MultipleEditTextProps> = ({
  caption,
  hintText,
  initialValues = [],
  padding = "px-3 py-2",
  buttonSize = 20,
  backgroundColor = "bg-white",
  onValuesChanged,
}) => {
  const [fields, setFields] = useState<string[]>(
    initialValues.length > 0 ? initialValues : [""]
  );
  const MAX_FIELDS = 10;

  // Notify parent component when values change
  useEffect(() => {
    if (onValuesChanged) {
      onValuesChanged(fields);
    }
  }, [fields, onValuesChanged]);

  const handleChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const addTextField = () => {
    // Prevent adding a new field if the last one is empty
    if (fields.length > 0 && fields[fields.length - 1] === "") {
      return;
    }

    // Ensure we don't exceed maximum fields
    if (fields.length < MAX_FIELDS) {
      setFields([...fields, ""]);
    }
  };

  const removeTextField = (index: number) => {
    if (fields.length > 1) {
      const newFields = [...fields];
      newFields.splice(index, 1);
      setFields(newFields);
    }
  };

  return (
    <div className={`rounded-lg p-4 ${backgroundColor}`}>
      <div className="mb-2 font-semibold text-sm">{caption}</div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={field}
              placeholder={hintText}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 text-sm border-none focus:ring-0 focus:outline-none bg-transparent"
            />

            <button
              onClick={() => removeTextField(index)}
              className={`${padding} bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors`}
              aria-label="Remove field"
            >
              <FiMinus size={buttonSize} />
            </button>

            {index === fields.length - 1 && fields.length < MAX_FIELDS && (
              <button
                onClick={addTextField}
                className={`${padding} bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors`}
                aria-label="Add field"
              >
                <FiMinus size={buttonSize} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleEditText;
