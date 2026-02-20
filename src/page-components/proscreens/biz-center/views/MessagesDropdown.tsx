import { useState } from "react";
import { Link } from "react-router-dom";
import Assets from "../../../../assets";

interface MessagesButtonProps {
  hasUnreadMessages?: boolean;
}

const MessagesButton: React.FC<MessagesButtonProps> = ({
  hasUnreadMessages = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mr-2.5">
      {/* Messages Icon Button */}
      <div
        className="relative w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={Assets.MessageIcon} // Make sure you have this icon in your assets
          alt="Messages"
          className="w-5 h-5"
        />

        {hasUnreadMessages && (
          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></div>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          {/* Header with title and close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Messages</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Messages Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            Messages List here
            {/* Replace with actual messages */}
          </div>

          {/* Footer with View All button */}
          <div className="p-3 border-t border-gray-200 text-center">
            <Link
              to="/messages"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
              onClick={() => setIsOpen(false)}
            >
              View All Messages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesButton;
