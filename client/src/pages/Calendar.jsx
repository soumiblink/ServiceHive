import { CalendarMonth, Event } from "@mui/icons-material";
import {
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import {
  useDeleteEventMutation,
  useGetMyEventsQuery,
  useUpdateEventMutation,
} from "../redux/api/api";
import { toast } from "react-hot-toast";
import EventCard from "../components/EventCard";

const Calendar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data, isLoading, error, isError } = useGetMyEventsQuery();

  const [deleteEvent] = useDeleteEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.msg || "Failed to load events");
    }
  }, [error, isError]);

  const handleStatusChange = async (id) => {
    try {
      const res = await updateEvent(id);
      if (res.data) {
        toast.success(res.data?.msg);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const res = await deleteEvent(id);
      if (res.data) {
        toast.success(res.data?.msg);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fafafa",
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading events...
        </Typography>
      </Box>
    );
  }

  const events = data?.events || [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg,  #466cf2ff 0%, #09d2f1ff 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          My Calendar
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", px: 2 }}
        >
          Manage your schedule and mark available time slots
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: 2, md: 4 },
          background: "white",
          border: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.06)",
          p: { xs: 2, md: 4 },
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: { xs: 3, md: 4 },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <CalendarMonth
              sx={{
                fontSize: { xs: 28, md: 32 },
                color: "primary.main",
                mr: 2,
              }}
            />
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
              All Events
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              {events.length} events
            </Typography>
          </Box>
        </Box>

        {events.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
            }}
          >
            <Event
              sx={{
                fontSize: { xs: 48, md: 64 },
                color: "text.secondary",
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              color="textSecondary"
              gutterBottom
            >
              No events scheduled
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Your schedule is clear for now
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteEvent}
                isMobile={isMobile}
              />
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Calendar;
