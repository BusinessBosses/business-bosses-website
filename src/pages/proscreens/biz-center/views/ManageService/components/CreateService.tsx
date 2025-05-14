import React, { useContext, useState, useEffect } from "react";
import { Service } from "../types/Service";
import { FiCalendar } from "react-icons/fi";

interface CreateServiceProps {
  onComplete?: () => void;
  editId?: string;
}

const CreateService: React.FC<CreateServiceProps> = ({
  onComplete,
  editId,
}) => {
  const emptyService: Service = {
    name: "",
    description: "",
    price: 0,
    category: "",
    createdAt: new Date(),
    id: 0,
    serviceType: "",
    isActive: false,
    discount: 0,
    location: "",
    itemType: "",
    packages: [],
    selectedDates: [],
    toJson: function (): Record<string, any> {
      throw new Error("Function not implemented.");
    },
  };

  const [service, setService] = useState<Service>(emptyService);
  const [isEditing, setIsEditing] = useState(false);

  // You need to provide the services array, either via props, context, or import.
  // For example, if services is passed as a prop, add it to CreateServiceProps and use it here.
  // Here is an example using a placeholder empty array:
  const services: Service[] = []; // TODO: Replace with actual services source

  useEffect(() => {
    if (editId) {
      const existingService = services.find((s) => s.id === Number(editId));
      if (existingService) {
        setService(existingService);
        setIsEditing(true);
      }
    }
  }, [editId, services]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Image
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            {service.images ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={service.images?.[0]}
                  alt={service.name}
                  className="max-h-28 max-w-full p-2"
                />
                <button
                  type="button"
                  onClick={() => {}}
                  className="absolute top-1 right-1 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <FiCalendar className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiCalendar className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or GIF (max. 2MB)
                </p>
              </div>
            )}
          </label>
        </div>
        <input
          type="text"
          name="imageUrl"
          value={service.images}
          onChange={handleInputChange}
          placeholder="Or paste image URL here"
          className="mt-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
        />
      </div>

      {/* Service Details */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Service Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={service.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={service.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              value={service.price}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Duration (minutes) *
          </label>
          =
        </div>

        <div>
          <label
            htmlFor="serviceType"
            className="block text-sm font-medium text-gray-700"
          >
            Service Type
          </label>
          <select
            id="serviceType"
            name="serviceType"
            value={service.serviceType}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a type</option>
            <option value="consultation">Consultation</option>
            <option value="treatment">Treatment</option>
            <option value="package">Package</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={service.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={service.isActive}
                onChange={(e) => () => {}}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isActive" className="font-medium text-gray-700">
                Active
              </label>
              <p className="text-gray-500">
                Make this service available for booking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? "Update Service" : "Add Service"}
        </button>
      </div>
    </form>
  );
};

export default CreateService;
