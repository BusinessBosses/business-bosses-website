import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import CustomEditText from "../../biz-center/components/customedittext";
import ProCustomButton from "../../biz-center/components/procustombutton";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../redux/store/store";
import ShopController from "../../biz-center/controllers/ShopController";
import CustomCard from "../../biz-center/components/customcard";
import Assets from "../../../../assets";
import CustomDropdown from "../../biz-center/components/customdropdown";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  clientType: string;
  description?: string;
  userId: string;
}

interface AddClientModalProps {
  client?: Client;
  onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ client, onClose }) => {
  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [clientType, setClientType] = useState(client?.clientType || "online");
  const [description, setDescription] = useState(client?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = React.useState(
    Assets.shopplaceholder
  );

  const profile = useAppSelector((state) => state.user);

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
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white w-full max-w-md">
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
            initialValue="Individual"
            caption="Image Type"
            hintText="Choose an image type"
            items={["Individual", "Company"]}
            onChanged={(value: string | null) => setClientType(value || "")}
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
      </div>
    </div>
  );
};

export default AddClientModal;
