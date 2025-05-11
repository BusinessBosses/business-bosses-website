import React, { useState } from "react";
import { FiUser, FiCheckSquare } from "react-icons/fi";
import { Client, ClientType } from "../models/client";
import { useAppSelector } from "../../../../redux/store/store";
import OptionsButton from "../../tasks/components/optionsbutton";

interface ClientWidgetProps {
  client: Client;
  bgColor: string;
  isExpanded?: boolean;
}

const ClientWidget: React.FC<ClientWidgetProps> = ({
  client,
  bgColor,
  isExpanded,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const currency = useAppSelector((state) => state.shop.shopInfo?.currency);

  const getClientTypeDisplay = (type: ClientType) => {
    switch (type) {
      case ClientType.ALL_CLIENTS:
        return "All Clients";
      case ClientType.ONLINE:
        return "Online";
      case ClientType.IN_PERSON:
        return "In-Person";
      default:
        return String(type);
    }
  };

  const getBorderColor = (type: ClientType) => {
    switch (type) {
      case ClientType.ONLINE:
        return "border-blue-500";
      case ClientType.IN_PERSON:
        return "border-amber-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <>
      <div
        className={`p-2 rounded-lg border border-l-4 my-4 ${getBorderColor(
          client.type
        )} bg-white`}
      >
        <div className="flex justify-between items-start">
          <div className="w-full">
            <div className="flex justify-between w-full items-center">
              <div className="bg-gray-100 w-fit px-2 py-1 rounded-md flex items-center">
                {client.image && client.image.length > 0 ? (
                  <img
                    src={client.image[0]}
                    alt={client.name}
                    className="w-4 h-4 rounded-full"
                  />
                ) : (
                  <FiUser size={15} />
                )}
                <h4 className="font-medium text-sm pl-2 text-gray-900">
                  {client.name}
                </h4>
              </div>
              <OptionsButton
                onEdit={() => setShowEditModal(true)}
                onDelete={() => setShowDeleteConfirm(true)}
                padding="p-1"
                borderColor="border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-bold">Email:</span> {client.email}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-bold">Phone:</span> {client.phone || "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-bold">Orders:</span> {client.orderCount} -{" "}
            {currency}
            {client.totalAmountSpent?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-bold">Type:</span>{" "}
            {getClientTypeDisplay(client.type)}
          </p>
        </div>

        {isExpanded && (
          <div className="mt-3 flex justify-end items-end">
            <button
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md mr-2"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Delete Client</h3>
            <p className="mb-6">Are you sure you want to delete this client?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
              >
                No
              </button>
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {
        showEditModal && {}
        // <AddClientModal
        //   client={client}
        //   onClose={() => setShowEditModal(false)}
        // />
      }
    </>
  );
};

export default ClientWidget;
