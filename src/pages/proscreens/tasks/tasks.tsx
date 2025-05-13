import { Box, Modal, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  DndProvider,
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiCheckSquare, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useAppSelector } from "../../../redux/store/store";
import ProCustomButton from "../biz-center/components/procustombutton";
import ShopController from "../biz-center/controllers/ShopController";
import AddProjectModal from "./components/addproject";
import CustomTabBarWidget from "./components/customtabbar";
import OptionsButton from "./components/optionsbutton";
import Spinner from "./components/spinner";
import { ProjectStatusChanger } from "./components/statusbutton";
import { Project, ProjectStatus } from "./models/projectsmodel";

const statusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.ALL]: "bg-gray-100",
  [ProjectStatus.TODO]: "bg-black",
  [ProjectStatus.INPROGRESS]: "bg-amber-500",
  [ProjectStatus.COMPLETED]: "bg-green-500",
};

const statusDisplayTitles: Record<ProjectStatus, string> = {
  [ProjectStatus.ALL]: "All Tasks",
  [ProjectStatus.TODO]: "To Do",
  [ProjectStatus.INPROGRESS]: "In-Progress",
  [ProjectStatus.COMPLETED]: "Completed",
};

const Tasks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState<Project | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterOption, setSelectedFilterOption] = useState("None");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shop = useAppSelector((state) => state.shop.shopInfo);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  // ← Fetch real projects on mount (or when userId changes)
  useEffect(() => {
    if (shop!.user) loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { projects: fetched } = await ShopController.initProjects(
        shop!.user!.uid
      );
      console.log(fetched);

      setProjects(fetched);
      setFilteredProjects(fetched);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & sort logic (unchanged)
  useEffect(() => {
    let items = [...projects];
    switch (selectedFilterOption) {
      case "Newest first":
        items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "Highest Budget":
        items.sort((a, b) => b.amount - a.amount);
        break;
      default:
        break;
    }
    setFilteredProjects(items);
  }, [selectedFilterOption, projects]);

  const handleEdit = (task: Project) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, projects]);

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    );
    ShopController.updateProject(projectId, { status: newStatus });
  };

  // derive per-status lists from the filtered set
  const statusProjects: Record<ProjectStatus, Project[]> = {
    all: filteredProjects,
    [ProjectStatus.TODO]: filteredProjects.filter(
      (p) => p.status === ProjectStatus.TODO
    ),
    pending: filteredProjects.filter(
      (p) => p.status === ProjectStatus.INPROGRESS
    ),
    completed: filteredProjects.filter(
      (p) => p.status === ProjectStatus.COMPLETED
    ),
  };

  // scrolling helpers (unchanged)
  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: index * window.innerWidth * 0.9,
        behavior: "smooth",
      });
    }
  };
  const moveMainList = (isRight: boolean) => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      const left = el.scrollLeft;
      if ((left <= 20 && !isRight) || (left >= max - 20 && isRight)) return;
      el.scrollTo({ left: left + (isRight ? 50 : -50), behavior: "smooth" });
      moveMainList(isRight);
    }, 100);
  };

  const handleCloseAddModal = () => {
    setOpen(false);
    setShowModal(false);
    loadProjects();
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditTask(undefined);
    loadProjects();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-50 rounded-2xl min-h-screen w-full flex flex-col items-center">
        {/* Header */}
        <header className="w-full rounded-t-2xl bg-white border-b px-5">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
            <ProCustomButton
              text="Add Task"
              icon={<FiPlus className="mr-2" />}
              onPressed={() => {
                if (isMobile) {
                  setOpen(true);
                } else {
                  setShowModal(true);
                }
              }}
            />
          </div>
        </header>
        {/* Tabs & Filters */}
        <div className="sm:container px-4 sm:px-0 w-full pt-5">
          <CustomTabBarWidget<ProjectStatus>
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scrollToSection={scrollToSection}
            proprimaryColor="#1F2937"
            backgroundColor={["#6b7280", "#f5f5f5", "#fef3c7", "#D3FFE3"]}
            listofitems={Object.values(ProjectStatus)}
            itemToString={(status) =>
              `${statusDisplayTitles[status]} (${
                status === ProjectStatus.ALL
                  ? projects.length
                  : statusProjects[status].length
              })`
            }
            filterOptions={["Newest first", "Highest Budget", "None"]}
            onFilterSelected={(opt) => opt && setSelectedFilterOption(opt)}
          />
        </div>
        {/* Content */}
        {loading ? (
          <div className="h-64 pt-52">
            <Spinner color="black" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
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
            className="flex overflow-x-auto pb-4 mt-4 scrollbar-hidden w-full sm:container px-4 sm:px-0"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {Object.values(ProjectStatus).map((status) => (
              <StatusColumn
                key={status}
                status={status}
                projects={
                  status === ProjectStatus.ALL
                    ? filteredProjects
                    : statusProjects[status]
                }
                allProjects={[]}
                onEdit={handleEdit}
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

        {/* Add Task Modal - For Mobile */}
        {isMobile ? (
          <BottomSheet
            open={open}
            onDismiss={handleCloseAddModal}
            style={{
              zIndex: theme.zIndex.modal,
            }}
          >
            <Box
              sx={{
                maxHeight: "90vh",
                overflowY: "auto",
                minHeight: "80vh",
                padding: 2,
              }}
            >
              <AddProjectModal onClose={handleCloseAddModal} />
            </Box>
          </BottomSheet>
        ) : (
          <Modal open={showModal} onClose={handleCloseAddModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <AddProjectModal onClose={handleCloseAddModal} />
            </Box>
          </Modal>
        )}
        {/* Edit Task Modal - For Mobile */}
        {isMobile ? (
          <BottomSheet
            open={showEditModal}
            onDismiss={handleCloseEditModal}
            style={{
              zIndex: theme.zIndex.modal,
            }}
          >
            <Box sx={{ maxHeight: "90vh", overflowY: "auto", padding: 2 }}>
              <AddProjectModal
                onClose={handleCloseEditModal}
                // projectToEdit={editTask}
              />
            </Box>
          </BottomSheet>
        ) : (
          <Modal open={showEditModal} onClose={handleCloseEditModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <AddProjectModal
                onClose={handleCloseEditModal}
                project={editTask}
                // projectToEdit={editTask}
              />
            </Box>
          </Modal>
        )}
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
  onEdit,
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
  onEdit: (task: Project) => void;
}) => {
  return (
    <div
      className="flex-shrink-0 w-11/12 sm:w-80 bg-white rounded-xl border mr-4 p-4 "
      style={{ scrollSnapAlign: "center" }}
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
              <TaskCard
                key={project.id}
                project={project}
                status={status}
                onEdit={onEdit}
              />
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
          onEdit={onEdit}
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
  onEdit,
}: {
  status: ProjectStatus;
  projects: Project[];
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
  onDrag: (isRight: boolean) => void;
  onEdit: (task: Project) => void;
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
          <DraggableTask
            key={project.id}
            project={project}
            onDrag={onDrag}
            onEdit={onEdit}
          />
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
  onEdit,
}: {
  project: Project;
  onDrag: (isRight: boolean) => void;
  onEdit: (task: Project) => void;
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
      <TaskCard project={project} status={project.status} onEdit={onEdit} />
    </div>
  );
};

const TaskCard = ({
  project,
  status,
  onEdit,
}: {
  project: Project;
  status: ProjectStatus;
  onEdit: (task: Project) => void;
}) => {
  const shop = useAppSelector((state) => state.shop.shopInfo);
  return (
    <div
      className={`p-2 rounded-lg border border-l-4 my-4 ${
        status === "to-do"
          ? "border-black"
          : status === "pending"
          ? "border-amber-500"
          : status === "completed"
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
              onEdit={() => onEdit(project)}
              onDelete={undefined}
              onView={undefined}
              onBoost={undefined}
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        <span className="font-bold">Expenses:</span> {shop!.currency}
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

export default Tasks;
