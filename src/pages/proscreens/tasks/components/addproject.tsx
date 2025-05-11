import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiX } from "react-icons/fi";
import CustomEditText from "../../biz-center/components/customedittext";
import ProCustomButton from "../../biz-center/components/procustombutton";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../redux/store/store";
import ShopController from "../../biz-center/controllers/ShopController";
import { Project } from "../models/projectsmodel";

// Temporary snackbar function for displaying messages
const showSnackbar = (message: string, isError: boolean) => {
  alert(`${isError ? "Error: " : ""}${message}`);
};

interface AddProjectModalProps {
  project?: Project;
  onClose: () => void;
  //   onSave: (projectData: Project, projectId?: string) => Promise<void>;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  project,
  onClose,
  //   onSave,
}) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [budget, setBudget] = useState(project?.amount?.toString() || "");
  const [currency, setCurrency] = useState("USD");
  const [startDate, setStartDate] = useState(
    project?.startAt ? new Date(project.startAt) : null
  );
  const [endDate, setEndDate] = useState(
    project?.endAt ? new Date(project.endAt) : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profile = useAppSelector((state) => state.user);
  const shop = useAppSelector((state) => state.shop.shopInfo);

  // Initialize currency from shop if available
  useEffect(() => {
    // Replace this with your actual shop location logic
    const shopLocation = "US"; // Example - get from your shop controller
    const currencyFromLocation = {
      US: "USD",
      UK: "GBP",
      // Add other currency mappings
    };
    setCurrency(currencyFromLocation[shopLocation] || "USD");
  }, []);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Name is mandatory!", { autoClose: 3000 });
      return;
    }
    if (!budget) {
      toast.error("Budget is mandatory!", { autoClose: 3000 });
      return;
    }
    if (!endDate || !startDate) {
      toast.error("You have to select task duration!", { autoClose: 3000 });
      return;
    }
    if (endDate < startDate) {
      toast.error("End date cannot be before start date!", { autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);

    const durationInDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const payload = {
      userId: profile.profile!.uid,
      name,
      amount: parseFloat(budget),
      description,
      duration: `${durationInDays} day(s)`,
      startAt: startDate.toISOString().split("T")[0],
      endAt: endDate.toISOString().split("T")[0],
    } as const;

    try {
      if (project) {
        // —— EDIT MODE ——
        const res = await ShopController.updateProject(project.id, payload);
        if (res.success) {
          toast.success("Task updated successfully!", { autoClose: 3000 });
          onClose();
        } else {
          toast.error(res.message || "Failed to update task", { autoClose: 3000 });
        }
      } else {
        // —— CREATE MODE ——
        const createData = {
          ...payload,
          userId: profile.profile!.uid,
        };
        const res = await ShopController.addProject(createData);
        if (res.success) {
          toast.success("Task added successfully!", { autoClose: 3000 });
          onClose();
        } else {
          toast.error(res.message || "Failed to add task", { autoClose: 3000 });
        }
      }
    } catch (err) {
      toast.error(
        project ? "Error while updating task!" : "Error while adding task!",
        { autoClose: 3000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white w-full max-w-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {project ? "Edit Task" : "Add New Task"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {project
                ? "Update the task details"
                : "Fill in the details below to create a new task"}
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
          <CustomEditText
            backgroundColor="bg-backgroundcolor"
            maxLength={30}
            caption="Task Name"
            hintText="Enter Task name here"
            value={name}
            onChange={(value: string) => setName(value)}
          />

          <CustomEditText
            backgroundColor="bg-backgroundcolor"
            caption="Task Description"
            hintText="Enter Task goals"
            value={description}
            onChange={(value: string) => setDescription(value)}
            maxLength={300}
          />

          <CustomEditText
            backgroundColor="bg-backgroundcolor"
            isCurrencyField={true}
            caption="Task Budget"
            maxLength={15}
            hintText="0.00"
            value={budget}
            onChange={(value: string) => setBudget(value)}
            inputType="number"
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select start date"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || undefined}
                placeholderText="Select end date"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <ProCustomButton
              text="Cancel"
              textColor="text-gray-900"
              color="bg-gray-100 hover:bg-gray-200"
              onPressed={onClose}
            />
            <ProCustomButton
              text={project ? "Update" : "Create"}
              loading={isSubmitting}
              onPressed={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
