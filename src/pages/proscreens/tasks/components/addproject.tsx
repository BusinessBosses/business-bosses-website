import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiX } from "react-icons/fi";
import CustomEditText from "../../biz-center/components/customedittext";
import ProCustomButton from "../../biz-center/components/procustombutton";

// Temporary snackbar function for displaying messages
const showSnackbar = (message: string, isError: boolean) => {
  alert(`${isError ? "Error: " : ""}${message}`);
};

interface Project {
  id?: string;
  name?: string;
  description?: string;
  amount?: number;
  startAt?: string;
  endAt?: string;
}

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
      showSnackbar("Name is mandatory!", true);
      return;
    }
    if (!budget) {
      showSnackbar("Budget is mandatory!", true);
      return;
    }
    if (!endDate || !startDate) {
      showSnackbar("You have to select task duration!", true);
      return;
    }
    if (endDate < startDate) {
      showSnackbar("End date cannot be before start date!", true);
      return;
    }

    setIsSubmitting(true);

    const durationInDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const projectData = {
      name,
      amount: parseFloat(budget),
      description,
      duration: `${durationInDays} day(s)`,
      startAt: startDate.toISOString().split("T")[0],
      endAt: endDate.toISOString().split("T")[0],
      currency,
    };

    // try {
    //   await onSave(projectData, project?.id);
    //   console.log(
    //     project ? "Task Updated Successfully!" : "Task Added Successfully!"
    //   );
    //   onClose();
    // } catch (error) {
    //   console.error(
    //     project ? "Error While Editing Task!" : "Error While Adding Task"
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
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
