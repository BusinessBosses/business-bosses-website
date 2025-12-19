import { FiCheckSquare } from "react-icons/fi";
import { Project, ProjectStatus } from "../models/projectsmodel";
import OptionsButton from "./optionsbutton";
import { ProjectStatusChanger } from "./statusbutton";

const TaskCard = ({
  project,
  status,
}: {
  project: Project;
  status: ProjectStatus;
}) => {
  return (
    <div
      className={`p-2 rounded-lg border border-l-4 my-4 ${
        status === ProjectStatus.TODO
          ? "border-black"
          : status === ProjectStatus.INPROGRESS
          ? "border-amber-500"
          : status === ProjectStatus.COMPLETED
          ? "border-green-500"
          : "border-gray-300"
      } bg-white`}
    >
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="flex justify-between w-full items-center justify-center">
            <div className="bg-backgroundcolor w-fit  px-2 py-1 rounded-md flex items-center justify-center">
              <FiCheckSquare size={15} />
              <h4 className="font-medium text-sm pl-2 text-gray-900">
                {project.name}
              </h4>
            </div>
            <OptionsButton
              item={undefined}
              isBoost={undefined}
              onEdit={undefined}
              onDelete={undefined}
              onView={undefined}
              onBoost={undefined}
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        <span className="font-bold">Expenses:</span> $
        {project.amount.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        <span className="font-bold">Duration:</span> {project.duration}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        <span className="font-bold">Description:</span> {project.description}
      </p>
      <div className="mt-3 flex justify-end items-end">
        <ProjectStatusChanger project={project} />
      </div>
    </div>
  );
};

export default TaskCard;
