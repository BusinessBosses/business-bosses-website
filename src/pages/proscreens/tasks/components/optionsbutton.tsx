import { useState, useRef } from "react";

type OptionsButtonProps = {
  padding?: string;
  borderColor?: string;
  isExpanded?: boolean;
  isEdit?: boolean;
  item?: any;
  isBoost?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onBoost?: () => void;
};

const OptionsButton = ({
  padding = "p-1",
  borderColor = "border-gray-200",
  isExpanded = false,
  isEdit = true,
  item,
  isBoost,
  onEdit,
  onDelete,
  onView,
  onBoost,
}: OptionsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: "view" | "edit" | "delete" | "boost") => {
    setIsOpen(false);
    switch (action) {
      case "view":
        onView?.();
        break;
      case "edit":
        onEdit?.();
        break;
      case "delete":
        onDelete?.();
        break;
      case "boost":
        onBoost?.();
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`bg-white rounded-lg border ${borderColor} border ${padding} flex items-center justify-center`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          style={{ minWidth: "120px" }}
        >
          {isExpanded && (
            <>
              <button
                onClick={() => handleAction("view")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                View
              </button>
              <div className="border-t border-gray-100 my-1"></div>
            </>
          )}

          {isEdit && (
            <>
              <button
                onClick={() => handleAction("edit")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Edit
              </button>
              <div className="border-t border-gray-100 my-1"></div>
            </>
          )}

          {isBoost && (
            <>
              <button
                onClick={() => handleAction("boost")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Boost
              </button>
              <div className="border-t border-gray-100 my-1"></div>
            </>
          )}

          <button
            onClick={() => handleAction("delete")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionsButton;
