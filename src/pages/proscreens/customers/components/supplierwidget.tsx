import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionsButton from "../../tasks/components/optionsbutton";
import ProCustomButton from "../../biz-center/components/procustombutton";

interface Supplier {
  id: string;
  name: string;
  description: string;
  location: string;
  images?: string[];
}

interface SuppliersCardProps {
  supplier: Supplier;
  status: string;
  onChangeSuppliersStatus: (status: string) => void;
  onTap: () => void;
}

const SuppliersCard: React.FC<SuppliersCardProps> = ({
  supplier,
  status,
  onChangeSuppliersStatus,
  onTap,
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const _onEdit = () => {
    navigate("/add-supplier", { state: { supplier } });
  };

  const showSnackbar = ({
    message,
    error = false,
  }: {
    message: string;
    error?: boolean;
  }) => {
    // Replace this with your actual snackbar implementation
    console.log(error ? `Error: ${message}` : message);
  };

  return (
    <>
      <div
        onClick={onTap}
        className="cursor-pointer rounded-xl p-4 border border-gray-200 bg-white"
      >
        <div className="flex flex-col items-center">
          <div className="h-10" />
          <div className="rounded-full overflow-hidden h-16 w-16 flex items-center justify-center bg-gray-100">
            {(supplier.images ?? []).length > 0 ? (
              <img
                src={(supplier.images ?? [])[0]}
                alt={supplier.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-gray-400">
                {/* Shop icon - replace with your icon component */}
                <svg
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="h-2" />
          <h3 className="font-bold text-sm text-gray-700 text-center line-clamp-2">
            {supplier.name}
          </h3>
          <p className="text-sm text-gray-600 text-center line-clamp-2">
            {supplier.description}
          </p>
          <p className="text-xs text-gray-500 text-center line-clamp-2">
            {supplier.location}
          </p>
          <div className="h-3" />
          <div className="flex w-full justify-between">
            <div className="flex-1"></div>
            <div className="w-2" />
            <OptionsButton
              item={supplier}
              onEdit={_onEdit}
              onDelete={() => setShowDeleteDialog(true)}
            />
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900">
              Delete Supplier
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this supplier?
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowDeleteDialog(false)}
              >
                No
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={() => {}}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuppliersCard;
