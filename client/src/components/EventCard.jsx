import {
  AccessTime,
  Delete as DeleteIcon,
  SwapHoriz as SwapIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  formatDay,
  formatMonth,
  formatTime,
  getDuration,
  getStatusConfig,
} from "../utils/features";

const EventCard = ({ event, onStatusChange, onDelete, isMobile }) => {
  const statusConfig = getStatusConfig(event.status);

  return (
    <Grid item xs={12} sm={6} lg={4} xl={3}>
      <Card
        sx={{
          borderRadius: 3,
          background: "white",
          border: "1px solid",
          borderColor: "rgba(99, 102, 241, 0.08)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "visible",
          height: "230px",
          display: "flex",
          width: { lg: "500px", xs: "85vw" },
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            borderColor: "rgba(99, 102, 241, 0.2)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 3,
            "&:last-child": { pb: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "linear-gradient(135deg, #466cf2ff 0%, #09d2f1ff 100%)",
                mr: 2,
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              {formatDay(event.startTime)}
            </Avatar>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="500"
              >
                {formatMonth(event.startTime)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(event.startTime).toLocaleString("en-US", {
                  weekday: "short",
                })}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              fontSize: "1rem",
              lineHeight: 1.3,
              mb: 2,
              minHeight: "2.6em",
              maxHeight: "2.6em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {event.title}
          </Typography>

          {/* Time and Duration */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <AccessTime
              sx={{ fontSize: 16, color: "primary.main", opacity: 0.8 }}
            />
            <Typography variant="body2" fontWeight="500" color="text.primary">
              {formatTime(event.startTime)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getDuration(event.startTime, event.endTime)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 3,
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                border: `1px solid ${statusConfig.color}20`,
              }}
            >
              <span style={{ fontSize: "12px" }}>{statusConfig.icon}</span>
              <span>
                {isMobile
                  ? statusConfig.label.split(" ")[0]
                  : statusConfig.label}
              </span>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {event.status === "BUSY" && (
                <IconButton
                  onClick={() => onStatusChange(event._id)}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(99, 102, 241, 0.08)",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.12)",
                    },
                  }}
                  title="Make Swappable"
                >
                  <SwapIcon fontSize="small" />
                </IconButton>
              )}
              {event.status === "SWAPPABLE" && (
                <IconButton
                  onClick={() => onStatusChange(event._id, "BUSY")}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(236, 72, 153, 0.08)",
                    color: "secondary.main",
                    "&:hover": {
                      backgroundColor: "rgba(236, 72, 153, 0.12)",
                    },
                  }}
                  title="Mark as Busy"
                >
                  <SwapIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                onClick={() => onDelete(event._id)}
                size="small"
                sx={{
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "rgba(239, 68, 68, 0.12)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default EventCard;
