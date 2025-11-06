import {
  AccessTime,
  Close as CloseIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

const AddEventModal = ({ open, onClose, onAddEvent }) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddEvent({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setStartTime("");
    setEndTime("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #466cf2ff 0%, #09d2f1ff 100%)",
          color: "white",
          py: 3,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <EventIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create New Event
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Add your schedule - Events are created as "Busy" by default
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* Event Title */}
            <Grid item xs={12}>
              <TextField
                autoFocus
                fullWidth
                label="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Team Meeting, Focus Time, Client Call"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(99, 102, 241, 0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(99, 102, 241, 0.4)",
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontWeight: 600,
                    color: "text.primary",
                  },
                }}
              />
            </Grid>

            {/* Date and Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTime sx={{ fontSize: 18, color: "primary.main" }} />
                    Start Time
                  </Box>
                }
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { fontWeight: 600, color: "text.primary" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTime sx={{ fontSize: 18, color: "primary.main" }} />
                    End Time
                  </Box>
                }
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(99, 102, 241, 0.2)",
                    },
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { fontWeight: 600, color: "text.primary" },
                }}
              />
            </Grid>

            {/* Status Info */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(107, 114, 128, 0.05)",
                  border: "1px solid rgba(107, 114, 128, 0.2)",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" fontWeight="600" gutterBottom>
                  🔴 Event will be created as "Busy"
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  You can mark it as "Swappable" later from your calendar
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            fullWidth={isMobile}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              borderColor: "grey.300",
              color: "text.primary",
              "&:hover": {
                borderColor: "grey.400",
                backgroundColor: "grey.50",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth={isMobile}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              background: "linear-gradient(135deg, #466cf2ff 0%, #09d2f1ff 100%)",
              boxShadow: "0 8px 25px -8px #6366f1",
              "&:hover": {
                background: "linear-gradient(135deg, #466cf2ff 0%, #09d2f1ff 100%)",
                boxShadow: "0 12px 35px -8px #6366f1",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Create Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEventModal;
