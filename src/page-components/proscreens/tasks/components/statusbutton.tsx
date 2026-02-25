import { useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import {
  Project,
  ProjectStatus,
  getStatusDisplayTitle,
} from "../models/projectsmodel";

const StatusButton = styled("div")(({ theme }) => ({
  padding: "5px 10px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StatusModalContent = ({
  project,
  availableStatuses,
  onStatusChange,
  onClose,
}: {
  project: Project;
  availableStatuses: ProjectStatus[];
  onStatusChange: (status: ProjectStatus) => void;
  onClose: () => void;
}) => (
  <Box sx={{ pt: 2, pb: 6 }}>
    <Typography
      variant="h6"
      sx={{
        fontSize: "14px",
        fontWeight: 700,
        textAlign: "center",
        mb: 2,
      }}
    >
      Change Task Status to
    </Typography>
    <List>
      {availableStatuses.map((status) => (
        <ListItem key={status} disablePadding>
          <ListItemButton
            onClick={() => {
              onStatusChange(status);
              onClose();
            }}
          >
            <Box
              sx={{
                backgroundColor: "background.paper",
                borderRadius: "15px",
                px: 2,
                py: 3,
                width: "100%",
              }}
            >
              <ListItemText
                primary={getStatusDisplayTitle(status)}
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              />
            </Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export const ProjectStatusChanger = ({ project }: { project: Project }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getAvailableStatuses = (): ProjectStatus[] => {
    switch (project.status) {
      case ProjectStatus.TODO:
        return [ProjectStatus.INPROGRESS, ProjectStatus.COMPLETED];
      case ProjectStatus.INPROGRESS:
        return [ProjectStatus.TODO, ProjectStatus.COMPLETED];
      case ProjectStatus.COMPLETED:
        return [ProjectStatus.TODO, ProjectStatus.INPROGRESS];
      default:
        return [];
    }
  };

  const getStatusBackgroundColor = (status: ProjectStatus): string => {
    switch (status) {
      case ProjectStatus.TODO:
        return "rgba(0, 0, 0, 0.1)"; // Equivalent to Colors.black.withOpacity(0.1)
      case ProjectStatus.INPROGRESS:
        return "rgba(251, 191, 36, 0.1)"; // Equivalent to Colors.amber.withOpacity(0.1)
      case ProjectStatus.COMPLETED:
        return "rgba(16, 185, 129, 0.1)"; // Equivalent to Colors.green.withOpacity(0.1)
      default:
        return "transparent";
    }
  };

  const getStatusTextColor = (status: ProjectStatus): string => {
    switch (status) {
      case ProjectStatus.TODO:
        return "black";
      case ProjectStatus.INPROGRESS:
        return "rgb(245, 158, 11)"; // amber-500
      case ProjectStatus.COMPLETED:
        return "rgb(16, 185, 129)"; // green-500
      default:
        return "black";
    }
  };

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    // Implement your status change logic here
    console.log(`Changing status to ${newStatus}`);
    // await updateProjectStatus(project.id, newStatus);
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <StatusButton
        onClick={handleOpen}
        sx={{
          backgroundColor: getStatusBackgroundColor(project.status),
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "12px",
            color: getStatusTextColor(project.status),
            fontWeight: "bold",
            mr: 1,
          }}
        >
          {`Status - ${getStatusDisplayTitle(project.status)}`}
        </Typography>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={getStatusTextColor(project.status)}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </StatusButton>

      {isMobile ? (
        <BottomSheet
          open={open}
          onDismiss={handleClose}
          style={{
            zIndex: theme.zIndex.modal,
          }}
        >
          <StatusModalContent
            project={project}
            availableStatuses={availableStatuses}
            onStatusChange={handleStatusChange}
            onClose={handleClose}
          />
        </BottomSheet>
      ) : (
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "20px",
              width: "400px",
              maxWidth: "90vw",
              p: 2,
            }}
          >
            <StatusModalContent
              project={project}
              availableStatuses={availableStatuses}
              onStatusChange={handleStatusChange}
              onClose={handleClose}
            />
          </Box>
        </Modal>
      )}
    </Box>
  );
};
