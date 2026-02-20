import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import CustomEditText from "../../biz-center/components/customedittext";
import ProCustomButton from "../../biz-center/components/procustombutton";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../redux/store/store";
import CustomCard from "../../biz-center/components/customcard";
import Assets from "../../../../assets";
import CustomDropdown from "../../biz-center/components/customdropdown";
import {
  Client,
  ClientType,
  getClientTypeDisplayTitle,
} from "../models/client";

interface AddClientModalProps {
  client?: Client;
  onClose: () => void;
  onSave?: (clientData: Client) => void;
  onUpdate?: (clientData: Client) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  client,
  onClose,
  onSave,
  onUpdate,
}) => {
  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [clientType, setClientType] = useState<ClientType>(
    client?.type || ClientType.ONLINE
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = React.useState(
    Assets.shopplaceholder
  );

  const profile = useAppSelector((state) => state.user);

  // Dropdown options are display strings, map enum values to these strings
  const clientTypeOptions = [
    ClientType.ONLINE,
    ClientType.IN_PERSON,
    // add more types here if needed
  ];

  const handleClientTypeChange = (selectedLabel: string | null) => {
    if (!selectedLabel) return;
    // find ClientType enum key by matching display title
    const foundType = clientTypeOptions.find(
      (type) => getClientTypeDisplayTitle(type) === selectedLabel
    );
    if (foundType) {
      setClientType(foundType);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Client name is mandatory!", { autoClose: 3000 });
      return;
    }
    if (!email) {
      toast.error("Email is mandatory!", { autoClose: 3000 });
      return;
    }
    if (!phone) {
      toast.error("Phone number is mandatory!", { autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);

    const clientData: Client = {
      id: client?.id || "", // generate new id if needed
      name,
      email,
      phone,
      userId: profile.profile!.uid,
      type: clientType,
      createdAt: client ? client.createdAt : new Date(),
      image: client?.image || [],
      orderCount: client?.orderCount || 0,
      totalAmountSpent: client?.totalAmountSpent || 0,
    };

    try {
      if (client) {
        if (onUpdate) await onUpdate(clientData);
      } else {
        if (onSave) await onSave(clientData);
      }
      onClose();
    } catch (error) {
      toast.error("An error occurred. Please try again.", { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {client ? "Edit Customer" : "Add New Customer"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {client
                ? "Update the customer details"
                : "Fill in the details below to add a new customer"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <CustomCard
            caption={"Customer Information"}
            subText={"Add a photo for your customer"}
            buttonText={"Choose Photo"}
            onPressed={() => document.getElementById("image-upload")?.click()}
            imagePath={selectedImage}
            iconPath={Assets.uploadicon}
          />

          <CustomEditText
            backgroundColor="bg-backgroundcolor"
            caption="Customer's Name"
            hintText="Enter customer name"
            value={name}
            onChange={(value: string) => setName(value)}
          />

          <CustomEditText
            backgroundColor="bg-backgroundcolor"
            caption="Customer's Email"
            hintText="Enter email address"
            value={email}
            onChange={(value: string) => setEmail(value)}
            inputType="email"
          />

          <CustomEditText
            backgroundColor="bg-backgroundcolor"
            caption="Customer's Phone number"
            hintText="Enter phone number"
            value={phone}
            onChange={(value: string) => setPhone(value)}
            inputType="tel"
          />

          <CustomDropdown
            initialValue={getClientTypeDisplayTitle(clientType)}
            caption="Client Type"
            hintText="Choose a client type"
            items={clientTypeOptions.map(getClientTypeDisplayTitle)}
            onChanged={handleClientTypeChange}
            backgroundColor="bg-backgroundcolor"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <ProCustomButton
              text="Cancel"
              textColor="text-gray-900"
              color="bg-gray-100 hover:bg-gray-200"
              onPressed={onClose}
            />
            <ProCustomButton
              text={client ? "Update" : "Add Client"}
              loading={isSubmitting}
              onPressed={handleSubmit}
            />
          </div>
        </div>

        {/* Hidden file input for image upload */}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (ev) => {
                setSelectedImage(ev.target?.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AddClientModal;
