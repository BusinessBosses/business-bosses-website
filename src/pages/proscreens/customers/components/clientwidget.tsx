<<<<<<< HEAD
export {};
=======
import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiUser } from "react-icons/fi";
import OptionsButton from "./optionsbutton";
import AddClientModal from "./addclientmodal";
import { Client, ClientType } from "../models/clientmodel";
import { useAppSelector } from "../redux/store";
import { useDeleteClientMutation } from "../services/clientsApi";

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
  const [deleteClient] = useDeleteClientMutation();

  const handleDelete = async () => {
    try {
      await deleteClient(client.id).unwrap();
      // Show success notification
    } catch (err) {
      // Show error notification
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const getClientTypeDisplay = (type: ClientType) => {
    switch (type) {
      case ClientType.ALL:
        return "All Clients";
      case ClientType.ONLINE:
        return "Online";
      case ClientType.INPERSON:
        return "In-Person";
      case ClientType.BBUSER:
        return "BB User";
      default:
        return type;
    }
  };

  return (
    <>
      <div className="border border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="p-4">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-3">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium`}
              style={{ backgroundColor: bgColor }}
            >
              {client.image && client.image.length > 0 ? (
                <img
                  src={client.image[0]}
                  alt={client.name}
                  className="w-4 h-4 rounded-full mr-2"
                />
              ) : (
                <FiUser className="w-4 h-4 text-gray-600 mr-2" />
              )}
              <span className="font-semibold">{client.name}</span>
            </div>

            <OptionsButton
              onEdit={() => setShowEditModal(true)}
              onDelete={() => setShowDeleteConfirm(true)}
              padding="p-1"
              borderColor="border-transparent"
            />
          </div>

          {/* Client Details */}
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-24">Email:</span>
              <span className="font-medium">{client.email}</span>
            </div>

            <div className="flex">
              <span className="text-gray-500 w-24">Phone:</span>
              <span className="font-medium">{client.phone || "N/A"}</span>
            </div>

            <div className="flex">
              <span className="text-gray-500 w-24">Total Orders:</span>
              <span className="font-medium">
                {client.orderCount} - {currency}
                {client.totalAmountSpent?.toLocaleString()}
              </span>
            </div>

            <div className="flex">
              <span className="text-gray-500 w-24">Customer type:</span>
              <span className="font-medium">
                {getClientTypeDisplay(client.type)}
              </span>
            </div>
          </div>
        </div>
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
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && (
        <AddClientModal
          client={client}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default ClientWidget;
>>>>>>> parent of c3320f8 (ui changes)
