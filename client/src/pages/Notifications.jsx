import {
  Check as AcceptIcon,
  AccessTime,
  Person,
  Close as RejectIcon,
  SwapHoriz as SwapIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGetMySwapRequestsQuery,
  useSwapRequestResponseMutation,
} from "../redux/api/api";
import { formatDate, formatDateTime, formatTime } from "../utils/features";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data, isLoading, error, isError, refetch } =
    useGetMySwapRequestsQuery();
  const [respondToSwap] = useSwapRequestResponseMutation();

  if (isError) {
    toast.error(error?.data?.msg || "Failed to load swap requests");
  }

  const incomingRequests = data?.incoming || [];
  const outgoingRequests = data?.outgoing || [];

  const handleResponse = async (requestId, accepted) => {
    try {
      const result = await respondToSwap({
        requestId,
        data: { accepted },
      }).unwrap();

      toast.success(
        result.msg ||
          `Request ${accepted ? "accepted" : "rejected"} successfully!`
      );
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.msg ||
          `Failed to ${accepted ? "accept" : "reject"} request`
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "ACCEPTED":
        return "Accepted";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const RequestCard = ({ request, type }) => {
    const isIncoming = type === "incoming";
    const user = isIncoming ? request.requester : request.receiver;
    const slot = isIncoming ? request.requesterSlot : request.receiverSlot;
    const mySlot = isIncoming ? request.receiverSlot : request.requesterSlot;

    return (
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "rgba(99, 102, 241, 0.1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            transform: "translateY(-2px)",
          },
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: isIncoming ? "primary.main" : "secondary.main",
                  mr: 2,
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {user?.name || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {isIncoming
                    ? "wants to swap with your slot"
                    : "requested your slot"}
                </Typography>
              </Box>
            </Box>

            <Chip
              label={getStatusText(request.status)}
              color={getStatusColor(request.status)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Their Slot Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              {slot?.title || "Unknown Slot"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTime sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" fontWeight="500">
                  {slot?.startTime ? formatTime(slot.startTime) : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonth sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" color="textSecondary">
                  {slot?.startTime ? formatDate(slot.startTime) : "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Your Slot Details (for incoming requests) */}
          {isIncoming && (
            <Box
              sx={{ mb: 3, p: 2, backgroundColor: "grey.50", borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight="600" gutterBottom>
                Your Slot:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {mySlot?.title || "Unknown Slot"} -{" "}
                {mySlot?.startTime ? formatTime(mySlot.startTime) : "N/A"}
              </Typography>
            </Box>
          )}

          {/* Request Time */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", mb: 2 }}
          >
            Requested{" "}
            {request.createdAt ? formatDateTime(request.createdAt) : "N/A"}
          </Typography>

          {/* Actions */}
          {isIncoming && request.status === "PENDING" && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                fullWidth={isMobile}
                variant="contained"
                startIcon={<AcceptIcon />}
                color="success"
                onClick={() => handleResponse(request._id, true)}
                sx={{
                  flex: isMobile ? 1 : "none",
                  py: 1,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  fontWeight: 600,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  },
                }}
              >
                Accept Swap
              </Button>
              <Button
                fullWidth={isMobile}
                variant="outlined"
                startIcon={<RejectIcon />}
                color="error"
                onClick={() => handleResponse(request._id, false)}
                sx={{
                  flex: isMobile ? 1 : "none",
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderColor: "error.main",
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "error.50",
                    borderColor: "error.dark",
                  },
                }}
              >
                Reject
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`notifications-tabpanel-${index}`}
        aria-labelledby={`notifications-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          py: 4,
          px: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Loading swap requests...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", py: 4, px: 2 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: { xs: "2.5rem", md: "3rem" },
            }}
          >
            Notifications
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Manage your swap requests and stay updated
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            background: "white",
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.06)",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                "& .MuiTab-root": {
                  fontSize: "1rem",
                  fontWeight: 600,
                  py: 2,
                  px: 3,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: "primary.main",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Incoming</Typography>
                    {incomingRequests.length > 0 && (
                      <Chip
                        label={incomingRequests.length}
                        color="primary"
                        size="small"
                        sx={{ minWidth: 24, height: 24, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Outgoing</Typography>
                    {outgoingRequests.length > 0 && (
                      <Chip
                        label={outgoingRequests.length}
                        color="secondary"
                        size="small"
                        sx={{ minWidth: 24, height: 24, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <TabPanel value={activeTab} index={0}>
              {incomingRequests.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <SwapIcon
                    sx={{
                      fontSize: 64,
                      color: "text.secondary",
                      mb: 2,
                      opacity: 0.5,
                    }}
                  />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No incoming requests
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    When someone requests to swap with your slots, they'll
                    appear here
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {incomingRequests.map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      type="incoming"
                    />
                  ))}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {outgoingRequests.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Person
                    sx={{
                      fontSize: 64,
                      color: "text.secondary",
                      mb: 2,
                      opacity: 0.5,
                    }}
                  />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No outgoing requests
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Your swap requests to others will appear here
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {outgoingRequests.map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      type="outgoing"
                    />
                  ))}
                </Box>
              )}
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

const CalendarMonth = (props) => (
  <svg
    {...props}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);

export default Notifications;
