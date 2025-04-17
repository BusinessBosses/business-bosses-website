import React, { useState, useEffect, useRef } from "react";
import {
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import CustomTabBarWidget from "./components/customtabbar";
import ProCustomButton from "../biz-center/components/procustombutton";
import { Modal } from "@mui/material";
import CustomEditText from "../biz-center/components/customedittext";
import CustomTextWidget from "../biz-center/components/customtextwidget";
import { FiMessageSquare, FiX, FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import AddProjectModal from "./components/addproject";
import Spinner from "./components/spinner";

type ProjectStatus = "all" | "todo" | "inprogress" | "completed";

interface Project {
  id: string;
  userId: string;
  name: string;
  amount: number;
  status: ProjectStatus;
  createdAt: Date;
  startAt: Date;
  endAt: Date;
  description: string;
  duration: string;
}

const statusColors: Record<ProjectStatus, string> = {
  all: "bg-gray-100",
  todo: "bg-black",
  inprogress: "bg-amber-500",
  completed: "bg-green-500",
};

const statusDisplayTitles: Record<ProjectStatus, string> = {
  all: "All Tasks",
  todo: "To Do",
  inprogress: "In-Progress",
  completed: "Completed",
};

const Tasks = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilterOption, setSelectedFilterOption] =
    useState<string>("None");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMoveRightRef = useRef<boolean | null>(null);

  // Mock data initialization
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "1",
        userId: "user1",
        name: "Website Redesign",
        amount: 5000,
        status: "todo",
        createdAt: new Date(2023, 5, 15),
        startAt: new Date(2023, 6, 1),
        endAt: new Date(2023, 6, 30),
        description: "Redesign company website with modern look",
        duration: "4 weeks",
      },
      {
        id: "2",
        userId: "user1",
        name: "Mobile App Development",
        amount: 15000,
        status: "inprogress",
        createdAt: new Date(2023, 4, 10),
        startAt: new Date(2023, 4, 15),
        endAt: new Date(2023, 7, 15),
        description: "Develop cross-platform mobile application",
        duration: "3 months",
      },
      {
        id: "3",
        userId: "user1",
        name: "Marketing Campaign",
        amount: 8000,
        status: "completed",
        createdAt: new Date(2023, 3, 1),
        startAt: new Date(2023, 3, 5),
        endAt: new Date(2023, 5, 5),
        description: "Summer marketing campaign",
        duration: "2 months",
      },
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollAmount = index * window.innerWidth * 0.9;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const moveMainList = (isRight: boolean) => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      if (!scrollContainerRef.current) return;

      const currentScroll = scrollContainerRef.current.scrollLeft;
      const maxScroll =
        scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth;

      if (
        (currentScroll <= 20 && !isRight) ||
        (currentScroll >= maxScroll - 20 && isRight)
      ) {
        return;
      }

      scrollContainerRef.current.scrollTo({
        left: currentScroll + (isRight ? 50 : -50),
        behavior: "smooth",
      });

      moveMainList(isRight);
    }, 100);
  };

  const filterProjects = () => {
    let filtered = [...projects];

    switch (selectedFilterOption) {
      case "Newest first":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "Highest Budget":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "None":
      default:
        // No sorting needed
        break;
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [selectedFilterOption, projects]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, status: newStatus } : project
      )
    );
  };

  const statusProjects = {
    all: filteredProjects,
    todo: filteredProjects.filter((p) => p.status === "todo"),
    inprogress: filteredProjects.filter((p) => p.status === "inprogress"),
    completed: filteredProjects.filter((p) => p.status === "completed"),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-2xl min-h-screen w-full flex flex-col items-center">
        {/* Header */}
        <header className="container">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
            <div className="flex items-center space-x-4">
              <ProCustomButton
                text="Add Tasks"
                // icon={<FiPlus className="mr-2" />}
                onPressed={() => setShowModal(true)}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container flex flex-col items-center">
          <div className="w-full">
            {/* Ensure full width */}
            <CustomTabBarWidget<ProjectStatus>
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scrollToSection={scrollToSection}
              proprimaryColor="#000000"
              backgroundColor={[
                "#6b7280", // all
                "#000000", // todo
                "#f59e0b", // inprogress
                "#10b981", // completed
              ]}
              listofitems={["all", "todo", "inprogress", "completed"]}
              itemToString={(status) =>
                `${statusDisplayTitles[status]} (${
                  status === "all"
                    ? projects.length
                    : statusProjects[status].length
                })`
              }
              filterOptions={["Newest first", "Highest Budget", "None"]}
              onFilterSelected={(option) => {
                if (option) setSelectedFilterOption(option);
              }}
            />
          </div>

          {loading ? (
            <div className="h-64 pt-52">
              <Spinner color="black" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg ">
              <h3 className="text-lg font-medium text-gray-900">
                No Tasks Found!
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first task to get started
              </p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 mt-4 scrollbar-hidden w-full container"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {(
                ["all", "todo", "inprogress", "completed"] as ProjectStatus[]
              ).map((status) => (
                <StatusColumn
                  key={status}
                  status={status}
                  projects={
                    status === "all" ? filteredProjects : statusProjects[status]
                  }
                  allProjects={filteredProjects}
                  onStatusChange={handleStatusChange}
                  onDrag={moveMainList}
                  showSearchBar={showSearchBar}
                  setShowSearchBar={setShowSearchBar}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Task Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <AddProjectModal
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </Modal>
      </div>
    </DndProvider>
  );
};

const StatusColumn = ({
  status,
  projects,
  allProjects,
  onStatusChange,
  onDrag,
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
}: {
  status: ProjectStatus;
  projects: Project[];
  allProjects: Project[];
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
  onDrag: (isRight: boolean) => void;
  showSearchBar: boolean;
  setShowSearchBar: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <div
      className="flex-shrink-0 w-11/12 sm:w-96 bg-white rounded-xl border mr-4 p-4"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {status !== "all" && (
            <div
              className={`w-2 h-2 rounded-full ${statusColors[status]} mr-2`}
            ></div>
          )}
          <h3 className="text-sm font-bold text-gray-900">
            {statusDisplayTitles[status]}
          </h3>
        </div>

        {status === "all" && (
          <div className="flex items-center">
            {showSearchBar ? (
              <div className="flex items-center">
                <input
                  type="text"
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => {
                    setShowSearchBar(false);
                    setSearchQuery("");
                  }}
                  className="ml-2 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchBar(true)}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <FiSearch className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      {status === "all" ? (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {projects.length > 0 ? (
            projects.map((project) => (
              <TaskCard key={project.id} project={project} status={status} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No tasks found matching your search
            </div>
          )}
        </div>
      ) : (
        <DropColumn
          status={status}
          projects={projects}
          onStatusChange={onStatusChange}
          onDrag={onDrag}
        />
      )}
    </div>
  );
};

const DropColumn = ({
  status,
  projects,
  onStatusChange,
  onDrag,
}: {
  status: ProjectStatus;
  projects: Project[];
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
  onDrag: (isRight: boolean) => void;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { project: Project }) => {
      onStatusChange(item.project.id, status);
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`overflow-y-auto rounded-lg ${isOver ? "bg-gray-100" : ""}`}
      style={{ maxHeight: "calc(100vh - 250px)", minHeight: "100px" }}
    >
      {projects.length > 0 ? (
        projects.map((project) => (
          <DraggableTask key={project.id} project={project} onDrag={onDrag} />
        ))
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
          Drag tasks here
        </div>
      )}
    </div>
  );
};

const DraggableTask = ({
  project,
  onDrag,
}: {
  project: Project;
  onDrag: (isRight: boolean) => void;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { project },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const screenWidth = window.innerWidth;
    if (e.clientX > screenWidth * 0.8) {
      onDrag(true);
    } else if (e.clientX < screenWidth * 0.2) {
      onDrag(false);
    }
  };

  return (
    <div
      ref={drag}
      draggable
      onDrag={handleDrag}
      className={`mb-3 ${isDragging ? "opacity-30" : "opacity-100"}`}
    >
      <TaskCard project={project} status={project.status} />
    </div>
  );
};

const TaskCard = ({
  project,
  status,
}: {
  project: Project;
  status: ProjectStatus;
}) => {
  return (
    <div
      className={`p-4 rounded-lg border border-l-4 my-4 ${
        status === "todo"
          ? "border-black"
          : status === "inprogress"
          ? "border-amber-500"
          : status === "completed"
          ? "border-green-500"
          : "border-gray-300"
      } bg-white`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{project.name}</h4>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>
        <span className="text-sm font-medium text-gray-900">
          ${project.amount.toLocaleString()}
        </span>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {project.startAt.toLocaleDateString()} -{" "}
          {project.endAt.toLocaleDateString()}
        </span>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
          {project.duration}
        </span>
      </div>
    </div>
  );
};

export default Tasks;
